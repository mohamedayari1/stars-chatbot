import { sendGeminiRequest } from '@/lib/ai/gemini';
import { ChatSDKError } from '@/lib/errors';
import type { ChatMessage, SearchResponse } from '@/lib/types';
import { vectorSearchService } from '@/lib/vectorSearch';
import { performance } from 'perf_hooks';
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

// RAG prompt template for Vedic astrology expert
const createRagPrompt = (query: string, contextChunks: string[]): string => {
  const contextText = contextChunks.length > 0 
    ? contextChunks.map((chunk, index) => `Context ${index + 1}:
${chunk}`).join('\n\n')
    : 'No relevant context found.';

  return `You are an expert Vedic astrologer and spiritual guide with deep knowledge of ancient Indian wisdom, astrology, and philosophy. You have studied the Vedas, Upanishads, and classical astrological texts extensively. Use the following context from authentic Vedic sources to answer the user's question with authority and wisdom.

Context:
${contextText}

User Question: ${query}

Please provide a comprehensive and authoritative answer based on the Vedic context provided. If the context doesn't contain enough information to answer the question accurately, acknowledge this and provide insights based on your deep knowledge of Vedic astrology and philosophy. Always maintain the spiritual and philosophical depth that characterizes authentic Vedic wisdom.`;
};

export async function POST(request: Request) {
  let requestBody: RagRequestBody;
  const totalStart = performance.now();

  try {
    const parseStart = performance.now();
    const json = await request.json();
    requestBody = ragRequestBodySchema.parse(json);
    const parseEnd = performance.now();
    console.log(`📝 [Parse] Request parsed in ${(parseEnd - parseStart).toFixed(2)}ms`);
  } catch (_) {
    console.log('❌ [Parse] Failed to parse request');
    return new ChatSDKError('bad_request:api').toResponse();
  }

  try {
    // Accept numResults as optional, default to 5 if not present
    const { message, numResults, selectedChatModel } = requestBody;
    const effectiveNumResults = typeof numResults === 'number' ? numResults : 5;
    console.log(`🤖 [Model] Selected chat model: ${selectedChatModel}`);

    // Extract the text from the message parts
    const extractStart = performance.now();
    const userText = message.parts
      .filter(part => part.type === 'text')
      .map(part => part.text)
      .join(' ');
    const extractEnd = performance.now();
    console.log(`💬 [Extract] User text extracted in ${(extractEnd - extractStart).toFixed(2)}ms`);

    if (!userText) {
      console.log('❌ [Extract] No text content found');
      return new ChatSDKError('bad_request:api', 'No text content found').toResponse();
    }

    // Step 1: Perform vector search to get relevant chunks
    const searchStart = performance.now();
    let searchResults: SearchResponse;
    try {
      await vectorSearchService.connect();
      const results = await vectorSearchService.search(userText, effectiveNumResults);

      searchResults = {
        success: true,
        results,
        query: userText,
        totalResults: results.length
      };
      const searchEnd = performance.now();
      console.log(`🔍 [Vector Search] Found ${results.length} results in ${(searchEnd - searchStart).toFixed(2)}ms`);
    } catch (searchError) {
      const searchEnd = performance.now();
      console.log(`❌ [Vector Search] Error in ${(searchEnd - searchStart).toFixed(2)}ms:`, searchError);
      searchResults = {
        success: false,
        results: [],
        query: userText,
        totalResults: 0,
        error: searchError instanceof Error ? searchError.message : 'Vector search failed'
      };
    }

    // Step 2: Extract context from search results
    const contextStart = performance.now();
    const contextChunks = searchResults.success
      ? searchResults.results.map(result => result.text)
      : [];
    const contextEnd = performance.now();
    console.log(`📚 [Context] Extracted ${contextChunks.length} context chunks in ${(contextEnd - contextStart).toFixed(2)}ms`);

    // Step 3: Create RAG prompt with context
    const promptStart = performance.now();
    const ragPrompt = createRagPrompt(userText, contextChunks);
    const promptEnd = performance.now();
    console.log(`📝 [Prompt] RAG prompt created in ${(promptEnd - promptStart).toFixed(2)}ms`);

    // Step 4: Send to Gemini with the RAG prompt
    const geminiStart = performance.now();
    const geminiResponse = await sendGeminiRequest({
      text: ragPrompt,
      temperature: 0.7,
      maxTokens: 2048
    });
    const geminiEnd = performance.now();
    console.log(`🔮 [Gemini] Gemini response received in ${(geminiEnd - geminiStart).toFixed(2)}ms`);

    if (!geminiResponse.success) {
      console.log('❌ [Gemini] Gemini API failed');
      return new ChatSDKError('bad_request:api', geminiResponse.error || 'Failed to get response from Gemini API').toResponse();
    }

    // Step 5: Create response with metadata about the search
    const responseStart = performance.now();
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
    const responseEnd = performance.now();
    console.log(`📦 [Response] Response prepared in ${(responseEnd - responseStart).toFixed(2)}ms`);

    const totalEnd = performance.now();
    console.log(`✅ [Total] RAG pipeline completed in ${(totalEnd - totalStart).toFixed(2)}ms`);

    return Response.json(responseData);

  } catch (error) {
    const totalEnd = performance.now();
    console.log(`❌ [Total] RAG route error after ${(totalEnd - totalStart).toFixed(2)}ms:`, error);
    return new ChatSDKError('bad_request:api', 'An error occurred while processing the RAG request').toResponse();
  }
} 