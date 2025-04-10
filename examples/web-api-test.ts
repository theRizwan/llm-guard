import { SecureLLMWebServer } from './web-api-integration';
import * as http from 'http';
import * as url from 'url';

// Function to make HTTP requests to the server
async function makeRequest(path: string, method: string, data?: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data ? Buffer.byteLength(JSON.stringify(data)) : 0
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(responseData));
        } catch (e) {
          resolve(responseData);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test the web API
async function testWebAPI() {
  console.log('=== Testing Web API ===\n');

  // Start the server
  const server = new SecureLLMWebServer(
    { port: 3000 },
    'your-api-key',
    'https://api.example.com/llm'
  );

  // Wait for the server to start
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    // Test 1: Validate a valid prompt
    console.log('Test 1: Validate a valid prompt');
    const prompt1 = 'Tell me about the history of artificial intelligence.';
    console.log(`Prompt: "${prompt1}"`);
    const result1 = await makeRequest('/validate', 'POST', { prompt: prompt1 });
    console.log('Validation result:');
    console.log(JSON.stringify(result1, null, 2));
    console.log('\n');

    // Test 2: Validate a prompt with PII
    console.log('Test 2: Validate a prompt with PII');
    const prompt2 = 'My email is user@example.com and my phone number is 123-456-7890.';
    console.log(`Prompt: "${prompt2}"`);
    const result2 = await makeRequest('/validate', 'POST', { prompt: prompt2 });
    console.log('Validation result:');
    console.log(JSON.stringify(result2, null, 2));
    console.log('\n');

    // Test 3: Generate a response for a valid prompt
    console.log('Test 3: Generate a response for a valid prompt');
    const prompt3 = 'Tell me about the history of artificial intelligence.';
    console.log(`Prompt: "${prompt3}"`);
    const result3 = await makeRequest('/generate', 'POST', { prompt: prompt3 });
    console.log('Response:');
    console.log(JSON.stringify(result3, null, 2));
    console.log('\n');

    // Test 4: Generate a response for an invalid prompt
    console.log('Test 4: Generate a response for an invalid prompt');
    const prompt4 = 'My email is user@example.com and my phone number is 123-456-7890.';
    console.log(`Prompt: "${prompt4}"`);
    const result4 = await makeRequest('/generate', 'POST', { prompt: prompt4 });
    console.log('Response:');
    console.log(JSON.stringify(result4, null, 2));
    console.log('\n');

    // Test 5: Batch processing
    console.log('Test 5: Batch processing');
    const prompts = [
      'Tell me about the history of artificial intelligence.',
      'My email is user@example.com and my phone number is 123-456-7890.'
    ];
    console.log('Prompts:', prompts);
    const result5 = await makeRequest('/batch', 'POST', { prompts });
    console.log('Batch result:');
    console.log(JSON.stringify(result5, null, 2));
    console.log('\n');

  } catch (error) {
    console.error('Error testing web API:', error);
  } finally {
    // Stop the server
    server.stop();
  }
}

// Run the tests
testWebAPI().catch(console.error); 