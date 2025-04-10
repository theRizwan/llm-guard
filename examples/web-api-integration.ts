import { LLMGuard, GuardConfig } from '../src';
import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import * as url from 'url';

// Configuration for the web server
interface ServerConfig {
  port: number;
  configPath?: string;
}

// Example API client for an LLM service
class LLMAPIClient {
  private apiKey: string;
  private endpoint: string;

  constructor(apiKey: string, endpoint: string) {
    this.apiKey = apiKey;
    this.endpoint = endpoint;
  }

  async generateResponse(prompt: string): Promise<string> {
    // In a real application, this would make an HTTP request to an LLM API
    console.log(`Making API request to ${this.endpoint} with prompt: "${prompt}"`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return `This is a simulated API response to: "${prompt}"`;
  }
}

// Web server that uses LLMGuard to validate prompts before sending to an LLM API
class SecureLLMWebServer {
  private server: http.Server;
  private guard: LLMGuard;
  private llmClient: LLMAPIClient;
  private config: GuardConfig;

  constructor(serverConfig: ServerConfig, apiKey: string, apiEndpoint: string) {
    // Initialize LLM API client
    this.llmClient = new LLMAPIClient(apiKey, apiEndpoint);
    
    // Load configuration from file if provided, otherwise use defaults
    if (serverConfig.configPath) {
      try {
        const configData = fs.readFileSync(serverConfig.configPath, 'utf8');
        this.config = JSON.parse(configData);
        console.log('Loaded configuration from file');
      } catch (error: any) {
        console.error(`Error loading config file: ${error.message || 'Unknown error'}`);
        this.config = this.getDefaultConfig();
      }
    } else {
      this.config = this.getDefaultConfig();
    }
    
    // Initialize LLMGuard
    this.guard = new LLMGuard(this.config);
    
    // Create HTTP server
    this.server = http.createServer(async (req, res) => {
      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      
      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }
      
      // Parse URL and query parameters
      const parsedUrl = url.parse(req.url || '', true);
      
      // Route requests
      if (parsedUrl.pathname === '/validate') {
        await this.handleValidateRequest(req, res);
      } else if (parsedUrl.pathname === '/generate') {
        await this.handleGenerateRequest(req, res);
      } else if (parsedUrl.pathname === '/batch') {
        await this.handleBatchRequest(req, res);
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
      }
    });
    
    // Start server
    this.server.listen(serverConfig.port, () => {
      console.log(`Server running at http://localhost:${serverConfig.port}/`);
    });
  }

  private getDefaultConfig(): GuardConfig {
    return {
      pii: true,
      jailbreak: true,
      profanity: true,
      promptInjection: true,
      relevance: true,
      toxicity: true,
      relevanceOptions: {
        minLength: 10,
        maxLength: 1000,
        minWords: 3,
        maxWords: 200
      }
    };
  }

  private async handleValidateRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method not allowed' }));
      return;
    }
    
    try {
      // Read request body
      const body = await this.readRequestBody(req);
      const { prompt } = JSON.parse(body);
      
      if (!prompt || typeof prompt !== 'string') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request: prompt is required' }));
        return;
      }
      
      // Validate the prompt
      const validationResult = await this.guard.validate(prompt);
      
      // Send response
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(validationResult));
    } catch (error: any) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message || 'Internal server error' }));
    }
  }

  private async handleGenerateRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method not allowed' }));
      return;
    }
    
    try {
      // Read request body
      const body = await this.readRequestBody(req);
      const { prompt } = JSON.parse(body);
      
      if (!prompt || typeof prompt !== 'string') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request: prompt is required' }));
        return;
      }
      
      // Validate the prompt
      const validationResult = await this.guard.validate(prompt);
      
      // Check if the prompt is valid
      const isValid = validationResult.results.every(result => result.valid);
      
      if (!isValid) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          error: 'Invalid prompt', 
          validationResult 
        }));
        return;
      }
      
      // Generate a response
      const response = await this.llmClient.generateResponse(prompt);
      
      // Send response
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        prompt,
        response,
        validationResult
      }));
    } catch (error: any) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message || 'Internal server error' }));
    }
  }

  private async handleBatchRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method not allowed' }));
      return;
    }
    
    try {
      // Read request body
      const body = await this.readRequestBody(req);
      const { prompts } = JSON.parse(body);
      
      if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request: prompts array is required' }));
        return;
      }
      
      // Validate all prompts
      const validationResults = await this.guard.validateBatch(prompts);
      
      // Process each prompt based on validation results
      const results = await Promise.all(
        prompts.map(async (prompt, index) => {
          const validationResult = validationResults.responses[index];
          const isValid = validationResult.results.every((result: any) => result.valid);
          
          if (!isValid) {
            return { prompt, isValid, validationResult };
          }
          
          const response = await this.llmClient.generateResponse(prompt);
          return { prompt, isValid, response, validationResult };
        })
      );
      
      // Send response
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ results }));
    } catch (error: any) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message || 'Internal server error' }));
    }
  }

  private readRequestBody(req: http.IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        resolve(body);
      });
      req.on('error', err => {
        reject(err);
      });
    });
  }

  stop(): void {
    this.server.close();
    console.log('Server stopped');
  }
}

// Example usage
async function main() {
  console.log('=== Secure LLM Web Server Example ===\n');
  
  // Create a web server with default configuration
  const server = new SecureLLMWebServer(
    { port: 3000 },
    'your-api-key',
    'https://api.example.com/llm'
  );
  
  console.log('Server started. Press Ctrl+C to stop.');
  
  // Keep the process running
  process.on('SIGINT', () => {
    server.stop();
    process.exit(0);
  });
}

// Example client code to interact with the server
async function exampleClientUsage() {
  console.log('Example client usage:');
  console.log('1. Validate a prompt:');
  console.log('   curl -X POST http://localhost:3000/validate -H "Content-Type: application/json" -d \'{"prompt":"Tell me about the history of artificial intelligence."}\'');
  console.log('\n2. Generate a response:');
  console.log('   curl -X POST http://localhost:3000/generate -H "Content-Type: application/json" -d \'{"prompt":"Tell me about the history of artificial intelligence."}\'');
  console.log('\n3. Process a batch of prompts:');
  console.log('   curl -X POST http://localhost:3000/batch -H "Content-Type: application/json" -d \'{"prompts":["Tell me about the history of artificial intelligence.", "My email is user@example.com"]}\'');
}

// Uncomment to run the example
// main().catch(console.error);

// Export for testing
export { SecureLLMWebServer, LLMAPIClient }; 