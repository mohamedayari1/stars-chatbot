// app/(chat)/api/vector-search-test/route.ts
import { vectorSearchService } from '@/lib/vectorSearch';
import { SearchRequest, SearchResponse } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse<SearchResponse>> {
  try {
    const { query, numResults = 5 }: SearchRequest = await request.json();

    if (!query?.trim()) {
      return NextResponse.json({
        success: false,
        results: [],
        query: '',
        totalResults: 0,
        error: 'Query is required'
      }, { status: 400 });
    }

    console.log(`Testing vector search for query: "${query}" with ${numResults} results`);

    // Test the vector search service
    try {
      await vectorSearchService.connect();
      const results = await vectorSearchService.search(query, numResults);

      console.log(`Vector search successful. Found ${results.length} results`);

      return NextResponse.json({
        success: true,
        results,
        query,
        totalResults: results.length
      });

    } catch (searchError) {
      console.error('Vector search error:', searchError);
      return NextResponse.json({
        success: false,
        results: [],
        query,
        totalResults: 0,
        error: searchError instanceof Error ? searchError.message : 'Vector search failed'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Test route error:', error);
    return NextResponse.json({
      success: false,
      results: [],
      query: '',
      totalResults: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Also support GET requests for simple testing
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const numResults = parseInt(searchParams.get('numResults') || '5');

  if (!query?.trim()) {
    return NextResponse.json({
      success: false,
      results: [],
      query: '',
      totalResults: 0,
      error: 'Query parameter is required'
    }, { status: 400 });
  }

  console.log(`Testing vector search for query: "${query}" with ${numResults} results`);

  try {
    await vectorSearchService.connect();
    const results = await vectorSearchService.search(query, numResults);

    console.log(`Vector search successful. Found ${results.length} results`);

    return NextResponse.json({
      success: true,
      results,
      query,
      totalResults: results.length
    });

  } catch (searchError) {
    console.error('Vector search error:', searchError);
    return NextResponse.json({
      success: false,
      results: [],
      query,
      totalResults: 0,
      error: searchError instanceof Error ? searchError.message : 'Vector search failed'
    }, { status: 500 });
  }
}