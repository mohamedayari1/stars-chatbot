import { sendGeminiStreamRequest } from '@/lib/ai/gemini';
import { ChatSDKError } from '@/lib/errors';
import type { SearchResponse } from '@/lib/types';
import { generateUUID } from '@/lib/utils';
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
    const json = await request.json();
    requestBody = ragRequestBodySchema.parse(json);
  } catch (_) {
    return new ChatSDKError('bad_request:api').toResponse();
  }

  try {
    const { message, numResults, selectedChatModel } = requestBody;
    const effectiveNumResults = typeof numResults === 'number' ? numResults : 5;
    
    // Extract user text
    const userText = message.parts
      .filter(part => part.type === 'text')
      .map(part => part.text)
      .join(' ');

    if (!userText) {
      return new ChatSDKError('bad_request:api', 'No text content found').toResponse();
    }

    // Perform vector search
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
    } catch (searchError) {
      searchResults = {
        success: false,
        results: [],
        query: userText,
        totalResults: 0,
        error: searchError instanceof Error ? searchError.message : 'Vector search failed'
      };
    }

    // Create RAG prompt
    const contextChunks = searchResults.success
      ? searchResults.results.map(result => result.text)
      : [];
    const ragPrompt = createRagPrompt(userText, contextChunks);

    // Create a simple streaming response using Server-Sent Events
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = '';
          
          // Stream the Gemini response
          for await (const chunk of sendGeminiStreamRequest({
            text: ragPrompt,
            temperature: 0.7,
            maxTokens: 2048
          })) {
            fullResponse += chunk;
            
            // Send each chunk as a Server-Sent Event
            const event = `data: ${JSON.stringify({
              id: generateUUID(),
              role: 'assistant',
              parts: [{ type: 'text', text: fullResponse }]
            })}\n\n`;
            
            controller.enqueue(encoder.encode(event));
          }

          // Send final message with metadata
          const finalEvent = `data: ${JSON.stringify({
            id: generateUUID(),
            role: 'assistant',
            parts: [{ type: 'text', text: fullResponse }],
            metadata: {
              searchPerformed: searchResults.success,
              contextChunksFound: contextChunks.length,
              totalSearchResults: searchResults.totalResults,
              searchQuery: userText,
              searchError: searchResults.error
            }
          })}\n\n`;
          
          controller.enqueue(encoder.encode(finalEvent));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();

        } catch (error) {
          console.error('Streaming error:', error);
          const errorEvent = `data: ${JSON.stringify({
            id: generateUUID(),
            role: 'assistant',
            parts: [{ type: 'text', text: 'Sorry, I encountered an error. Please try again.' }]
          })}\n\n`;
          
          controller.enqueue(encoder.encode(errorEvent));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        }
      }
    });

    const totalEnd = performance.now();
    console.log(`✅ [Total] RAG streaming pipeline completed in ${(totalEnd - totalStart).toFixed(2)}ms`);

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    const totalEnd = performance.now();
    console.log(`❌ [Total] RAG route error after ${(totalEnd - totalStart).toFixed(2)}ms:`, error);
    return new ChatSDKError('bad_request:api', 'An error occurred while processing the RAG request').toResponse();
  }
} 