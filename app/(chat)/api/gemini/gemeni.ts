import { sendGeminiRequest } from '@/lib/ai/gemini';
import { ChatSDKError } from '@/lib/errors';
import type { ChatMessage } from '@/lib/types';
import { z } from 'zod';

// Schema for the request body
const geminiRequestBodySchema = z.object({
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
});

type GeminiRequestBody = z.infer<typeof geminiRequestBodySchema>;

export const maxDuration = 60;

export async function POST(request: Request) {
  let requestBody: GeminiRequestBody;

  try {
    const json = await request.json();
    requestBody = geminiRequestBodySchema.parse(json);
  } catch (_) {
    return new ChatSDKError('bad_request:api').toResponse();
  }

  try {
    const { message } = requestBody;
    
    // Extract the text from the message parts
    const userText = message.parts
      .filter(part => part.type === 'text')
      .map(part => part.text)
      .join(' ');

    if (!userText) {
      return new ChatSDKError('bad_request:api', 'No text content found').toResponse();
    }

    // Use the separate Gemini function
    const geminiResponse = await sendGeminiRequest({
      text: userText,
      temperature: 0.7,
      maxTokens: 2048
    });

    if (!geminiResponse.success) {
      return new ChatSDKError('bad_request:api', geminiResponse.error || 'Failed to get response from Gemini API').toResponse();
    }
    
    // Create a response in the same format as the original chat route
    const assistantMessage: ChatMessage = {
      id: `gemini-${Date.now()}`,
      role: 'assistant',
      parts: [
        {
          type: 'text',
          text: geminiResponse.text
        }
      ]
    };

    return Response.json({
      messages: [assistantMessage],
      id: requestBody.id
    });

  } catch (error) {
    console.error('Gemini route error:', error);
    return new ChatSDKError('bad_request:api', 'An error occurred while processing the request').toResponse();
  }
} 