import { sendGeminiRequest } from '@/lib/ai/gemini';
import { ChatSDKError } from '@/lib/errors';
import type { ChatMessage, SearchResponse } from '@/lib/types';
import { vectorSearchService } from '@/lib/vectorSearch';
import { z } from 'zod';

// Schema for the RAG request body
const ragRequestBodySchema = z.object({
  id: z.string(),
  message: z.object({
    role: z.string(),
    parts: z.array(z.object({
      type: z.string(),
      text: z.string(),
    })),
    id: z.string(),
  }),
  selectedChatModel: z.string(),
  selectedVisibilityType: z.string(),
  numResults: z.number().optional().default(5),
});

type RagRequestBody = z.infer<typeof ragRequestBodySchema>;

export const maxDuration = 60;

// RAG prompt template
const createRagPrompt = (query: string, contextChunks: string[]): string => {
  const contextText = contextChunks.length > 0 
    ? contextChunks.map((chunk, index) => `Context ${index + 1}:\n${chunk}`).join('\n\n')
    : 'No relevant context found.';

  return `You are a helpful AI assistant. Use the following context to answer the user's question. If the context doesn't contain enough information to answer the question accurately, say so and provide a general response based on your knowledge.

Context:
${contextText}

User Question: ${query}

Please provide a comprehensive answer based on the context provided. If the context is not sufficient, acknowledge this and provide the best possible answer with your general knowledge.`;
};

export async function POST(request: Request) {
  let requestBody: RagRequestBody;

  try {
    const json = await request.json();
    requestBody = ragRequestBodySchema.parse(json);
  } catch (_) {
    return new ChatSDKError('bad_request:api').toResponse();
  }

  try {
    const { message, numResults = 5 } = requestBody;
    
    // Extract the text from the message parts
    const userText = message.parts
      .filter(part => part.type === 'text')
      .map(part => part.text)
      .join(' ');

    if (!userText) {
      return new ChatSDKError('bad_request:api', 'No text content found').toResponse();
    }

    // Step 1: Perform vector search to get relevant chunks
    let searchResults: SearchResponse;
    try {
      await vectorSearchService.connect();
      const results = await vectorSearchService.search(userText, numResults);
      
      searchResults = {
        success: true,
        results,
        query: userText,
        totalResults: results.length
      };
    } catch (searchError) {
      console.error('Vector search error:', searchError);
      searchResults = {
        success: false,
        results: [],
        query: userText,
        totalResults: 0,
        error: searchError instanceof Error ? searchError.message : 'Vector search failed'
      };
    }

    // Step 2: Extract context from search results
    const contextChunks = searchResults.success 
      ? searchResults.results.map(result => result.document.text)
      : [];

    // Step 3: Create RAG prompt with context
    const ragPrompt = createRagPrompt(userText, contextChunks);

    // Step 4: Send to Gemini with the RAG prompt
    const geminiResponse = await sendGeminiRequest({
      text: ragPrompt,
      temperature: 0.7,
      maxTokens: 2048
    });

    if (!geminiResponse.success) {
      return new ChatSDKError('bad_request:api', geminiResponse.error || 'Failed to get response from Gemini API').toResponse();
    }
    
    // Step 5: Create response with metadata about the search
    const assistantMessage: ChatMessage = {
      id: `rag-${Date.now()}`,
      role: 'assistant',
      parts: [
        {
          type: 'text',
          text: geminiResponse.text
        }
      ]
    };

    // Include search metadata in the response
    const responseData = {
      messages: [assistantMessage],
      id: requestBody.id,
      metadata: {
        searchPerformed: searchResults.success,
        contextChunksFound: contextChunks.length,
        totalSearchResults: searchResults.totalResults,
        searchQuery: userText,
        searchError: searchResults.error
      }
    };

    return Response.json(responseData);

  } catch (error) {
    console.error('RAG route error:', error);
    return new ChatSDKError('bad_request:api', 'An error occurred while processing the RAG request').toResponse();
  }
} 