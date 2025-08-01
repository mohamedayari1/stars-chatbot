import { GoogleGenAI } from "@google/genai";

export interface GeminiRequest {
  text: string;
  temperature?: number;
  maxTokens?: number;
}

export interface GeminiResponse {
  text: string;
  success: boolean;
  error?: string;
}

const API_KEY = 'AIzaSyBmOVAdUB54vGOHroYOJ7OtC06YrFDOST0';
const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Send a request to Google Gemini API using the official SDK
 * @param request - The request object containing text and optional parameters
 * @returns Promise<GeminiResponse> - The response from Gemini
 */
export async function sendGeminiRequest(request: GeminiRequest): Promise<GeminiResponse> {
  try {
    const { text, temperature = 0.7, maxTokens = 2048 } = request;

    if (!text || text.trim() === '') {
      return {
        text: '',
        success: false,
        error: 'No text provided'
      };
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp", // Using the latest model
      contents: text.trim(),
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
        topK: 40,
        topP: 0.95,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    });

    if (!response.text) {
      return {
        text: '',
        success: false,
        error: 'No response text found in API response'
      };
    }

    return {
      text: response.text,
      success: true
    };

  } catch (error) {
    console.error('Gemini request error:', error);
    return {
      text: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Test function to verify Gemini API connection
 * @returns Promise<boolean> - True if connection is successful
 */
export async function testGeminiConnection(): Promise<boolean> {
  const result = await sendGeminiRequest({
    text: 'Hello, this is a test message. Please respond with "Connection successful!"',
    temperature: 0.1,
    maxTokens: 50
  });

  return result.success;
} 