import { GoogleGenAI } from "@google/genai";
import { sendGeminiRequest, testGeminiConnection } from './gemini';

const API_KEY = 'AIzaSyBmOVAdUB54vGOHroYOJ7OtC06YrFDOST0';
const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * List available models
 */
async function listModels() {
  console.log('📋 Listing available models...');
  try {
    const models = await ai.models.list();
    console.log('✅ Available models:');
    models.forEach(model => {
      console.log(`  - ${model.name} (${model.displayName})`);
    });
  } catch (error) {
    console.log('❌ Failed to list models:', error);
  }
}

/**
 * Test the Gemini API connection
 */
async function testConnection() {
  console.log('🔗 Testing Gemini API connection...');
  const isConnected = await testGeminiConnection();
  
  if (isConnected) {
    console.log('✅ Gemini API connection successful!');
  } else {
    console.log('❌ Gemini API connection failed!');
  }
  
  return isConnected;
}

/**
 * Test a simple text request
 */
async function testSimpleRequest() {
  console.log('\n📝 Testing simple text request...');
  
  const response = await sendGeminiRequest({
    text: 'Hello! Please respond with a short greeting.',
    temperature: 0.3,
    maxTokens: 100
  });
  
  if (response.success) {
    console.log('✅ Response received:');
    console.log(response.text);
  } else {
    console.log('❌ Request failed:');
    console.log(response.error);
  }
  
  return response;
}

/**
 * Test a more complex request
 */
async function testComplexRequest() {
  console.log('\n🧠 Testing complex request...');
  
  const response = await sendGeminiRequest({
    text: 'Explain quantum computing in simple terms in 2-3 sentences.',
    temperature: 0.7,
    maxTokens: 200
  });
  
  if (response.success) {
    console.log('✅ Response received:');
    console.log(response.text);
  } else {
    console.log('❌ Request failed:');
    console.log(response.error);
  }
  
  return response;
}

/**
 * Test error handling with empty text
 */
async function testErrorHandling() {
  console.log('\n🚫 Testing error handling...');
  
  const response = await sendGeminiRequest({
    text: '',
    temperature: 0.7,
    maxTokens: 100
  });
  
  if (!response.success) {
    console.log('✅ Error handling works correctly:');
    console.log(response.error);
  } else {
    console.log('❌ Error handling failed - should have returned an error');
  }
  
  return response;
}

/**
 * Run all tests
 */
export async function runGeminiTests() {
  console.log('🚀 Starting Gemini API tests...\n');
  
  try {
    // List available models first
    await listModels();
    
    // Test connection
    const connectionTest = await testConnection();
    
    if (!connectionTest) {
      console.log('\n❌ Stopping tests due to connection failure');
      return;
    }
    
    // Run other tests
    await testSimpleRequest();
    await testComplexRequest();
    await testErrorHandling();
    
    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('\n💥 Test suite failed:', error);
  }
}

// If this file is run directly (not imported), run the tests
if (require.main === module) {
  runGeminiTests().catch(console.error);
} 