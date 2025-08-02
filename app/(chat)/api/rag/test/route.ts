import { sendGeminiRequest } from '@/lib/ai/gemini';
import { vectorSearchService } from '@/lib/vectorSearch';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { query, numResults = 3 } = await request.json();

    if (!query?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Query is required'
      }, { status: 400 });
    }

    // Test vector search
    let searchResults;
    try {
      await vectorSearchService.connect();
      const results = await vectorSearchService.search(query, numResults);
      searchResults = {
        success: true,
        results,
        totalResults: results.length
      };
    } catch (error) {
      searchResults = {
        success: false,
        error: error instanceof Error ? error.message : 'Search failed'
      };
    }

    // Test Gemini
    let geminiResults;
    try {
      const response = await sendGeminiRequest({
        text: `Test query: ${query}`,
        temperature: 0.7,
        maxTokens: 100
      });
      geminiResults = {
        success: response.success,
        text: response.text,
        error: response.error
      };
    } catch (error) {
      geminiResults = {
        success: false,
        error: error instanceof Error ? error.message : 'Gemini failed'
      };
    }

    return NextResponse.json({
      query,
      vectorSearch: searchResults,
      gemini: geminiResults,
      overallSuccess: searchResults.success && geminiResults.success
    });

  } catch (error) {
    console.error('RAG test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 