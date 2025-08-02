# RAG (Retrieval-Augmented Generation) Route

This implementation provides a RAG route that combines vector search with Gemini AI to provide context-aware responses.

## Overview

The RAG route (`/api/rag`) performs the following steps:

1. **Query Processing**: Extracts the user's question from the request
2. **Vector Search**: Searches for relevant context chunks using cosine similarity
3. **Context Injection**: Injects the retrieved chunks into a prompt template
4. **LLM Generation**: Sends the enhanced prompt to Gemini for response generation
5. **Response**: Returns the AI response with metadata about the search process

## Files Created

- `app/(chat)/api/rag/route.ts` - Main RAG route
- `app/(chat)/api/rag/test/route.ts` - Test route for debugging
- `RAG_README.md` - This documentation

## Dependencies Added

- `@azure/openai` - For Azure OpenAI embeddings
- `mongodb` - For MongoDB/Cosmos DB vector search

## Environment Variables Required

Make sure you have these environment variables set:

```env
# Azure OpenAI (for embeddings)
AZURE_OPENAI_API_KEY=your_azure_openai_key
AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
AZURE_OPENAI_API_VERSION=2024-02-15-preview
AZURE_OPENAI_DEPLOYMENT_NAME=your_embedding_model_name

# Cosmos DB MongoDB
COSMOS_MONGO_CONNECTION_STRING=your_cosmos_mongo_connection_string
COSMOS_MONGO_DATABASE_NAME=your_database_name
COSMOS_MONGO_COLLECTION_NAME=your_collection_name
```

## Usage

### Main RAG Route

**Endpoint**: `POST /api/rag`

**Request Body**:

```json
{
  "id": "chat-id",
  "message": {
    "role": "user",
    "parts": [
      {
        "type": "text",
        "text": "What is machine learning?"
      }
    ],
    "id": "message-id"
  },
  "selectedChatModel": "gemini",
  "selectedVisibilityType": "public",
  "numResults": 5
}
```

**Response**:

```json
{
  "messages": [
    {
      "id": "rag-1234567890",
      "role": "assistant",
      "parts": [
        {
          "type": "text",
          "text": "Based on the context provided..."
        }
      ]
    }
  ],
  "id": "chat-id",
  "metadata": {
    "searchPerformed": true,
    "contextChunksFound": 3,
    "totalSearchResults": 3,
    "searchQuery": "What is machine learning?",
    "searchError": null
  }
}
```

### Test Route

**Endpoint**: `POST /api/rag/test`

**Request Body**:

```json
{
  "query": "What is machine learning?",
  "numResults": 3
}
```

**Response**:

```json
{
  "query": "What is machine learning?",
  "vectorSearch": {
    "success": true,
    "results": [...],
    "totalResults": 3
  },
  "gemini": {
    "success": true,
    "text": "Test response...",
    "error": null
  },
  "overallSuccess": true
}
```

## Features

### 1. Robust Error Handling

- Graceful handling of vector search failures
- Fallback to general knowledge when no context is found
- Detailed error reporting in metadata

### 2. Configurable Search

- Adjustable number of search results (`numResults`)
- Configurable temperature and max tokens for Gemini

### 3. Context-Aware Prompting

- Intelligent prompt template that handles cases with/without context
- Clear separation between context and user question
- Instructions for the AI to acknowledge when context is insufficient

### 4. Search Metadata

- Returns information about the search process
- Includes number of chunks found and search success status
- Useful for debugging and monitoring

## Prompt Template

The RAG prompt template is designed to:

1. **Provide Context**: Include all relevant chunks from vector search
2. **Handle Missing Context**: Gracefully handle cases where no relevant chunks are found
3. **Guide Response**: Instruct the AI to use context when available and fall back to general knowledge
4. **Maintain Quality**: Ensure responses are comprehensive and accurate

## Installation

1. Install the new dependencies:

```bash
pnpm install
```

2. Set up your environment variables

3. Test the implementation:

```bash
curl -X POST http://localhost:3000/api/rag/test \
  -H "Content-Type: application/json" \
  -d '{"query": "test question", "numResults": 3}'
```

## Troubleshooting

### Common Issues

1. **Vector Search Fails**: Check your Cosmos DB connection string and collection setup
2. **Gemini API Errors**: Verify your Google AI API key and model access
3. **No Context Found**: Ensure your vector database has indexed documents
4. **Embedding Errors**: Check Azure OpenAI configuration and deployment name

### Debug Mode

Use the test route (`/api/rag/test`) to isolate issues between vector search and Gemini components.

## Performance Considerations

- **Search Results**: Default to 5 results, but can be adjusted based on your needs
- **Token Limits**: Set appropriate max tokens based on your context size
- **Temperature**: 0.7 provides a good balance between creativity and accuracy
- **Caching**: Consider implementing caching for frequently searched queries
