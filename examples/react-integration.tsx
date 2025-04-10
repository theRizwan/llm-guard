import React, { useState, useEffect } from 'react';
import { LLMGuard, GuardConfig } from '../src';

// Example component that uses LLMGuard to validate prompts before sending to an LLM API
const SecureLLMComponent: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [guard, setGuard] = useState<LLMGuard | null>(null);
  const [config, setConfig] = useState<GuardConfig>({
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
  });

  // Initialize LLMGuard with configuration
  useEffect(() => {
    const initializeGuard = async () => {
      try {
        // In a real application, you might load the config from an API or local storage
        const newGuard = new LLMGuard(config);
        setGuard(newGuard);
      } catch (err: any) {
        setError(`Error initializing guard: ${err.message || 'Unknown error'}`);
      }
    };

    initializeGuard();
  }, [config]);

  // Handle prompt validation
  const handleValidate = async () => {
    if (!guard) {
      setError('Guard not initialized');
      return;
    }

    setIsLoading(true);
    setError(null);
    setValidationResult(null);

    try {
      const result = await guard.validate(prompt);
      setValidationResult(result);
    } catch (err: any) {
      setError(`Validation error: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle prompt submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guard) {
      setError('Guard not initialized');
      return;
    }

    setIsLoading(true);
    setError(null);
    setValidationResult(null);
    setResponse('');

    try {
      // Validate the prompt
      const result = await guard.validate(prompt);
      setValidationResult(result);
      
      // Check if the prompt is valid
      const isValid = result.results.every((r: any) => r.valid);
      
      if (!isValid) {
        setError('Invalid prompt. See validation results for details.');
        return;
      }
      
      // In a real application, this would call an API to generate a response
      // For this example, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResponse(`This is a simulated response to: "${prompt}"`);
    } catch (err: any) {
      setError(`Error: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle guard options
  const toggleGuardOption = (option: keyof GuardConfig) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      [option]: !prevConfig[option]
    }));
  };

  // Update relevance options
  const updateRelevanceOptions = (option: keyof typeof config.relevanceOptions, value: number) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      relevanceOptions: {
        ...prevConfig.relevanceOptions,
        [option]: value
      }
    }));
  };

  return (
    <div className="secure-llm-component">
      <h1>Secure LLM Prompt Validator</h1>
      
      <div className="config-section">
        <h2>Guard Configuration</h2>
        <div className="config-options">
          <label>
            <input
              type="checkbox"
              checked={config.pii}
              onChange={() => toggleGuardOption('pii')}
            />
            PII Detection
          </label>
          <label>
            <input
              type="checkbox"
              checked={config.jailbreak}
              onChange={() => toggleGuardOption('jailbreak')}
            />
            Jailbreak Detection
          </label>
          <label>
            <input
              type="checkbox"
              checked={config.profanity}
              onChange={() => toggleGuardOption('profanity')}
            />
            Profanity Filter
          </label>
          <label>
            <input
              type="checkbox"
              checked={config.promptInjection}
              onChange={() => toggleGuardOption('promptInjection')}
            />
            Prompt Injection Detection
          </label>
          <label>
            <input
              type="checkbox"
              checked={config.relevance}
              onChange={() => toggleGuardOption('relevance')}
            />
            Relevance Check
          </label>
          <label>
            <input
              type="checkbox"
              checked={config.toxicity}
              onChange={() => toggleGuardOption('toxicity')}
            />
            Toxicity Detection
          </label>
        </div>
        
        <h3>Relevance Options</h3>
        <div className="relevance-options">
          <div>
            <label>Min Length:</label>
            <input
              type="number"
              value={config.relevanceOptions.minLength}
              onChange={(e) => updateRelevanceOptions('minLength', parseInt(e.target.value))}
            />
          </div>
          <div>
            <label>Max Length:</label>
            <input
              type="number"
              value={config.relevanceOptions.maxLength}
              onChange={(e) => updateRelevanceOptions('maxLength', parseInt(e.target.value))}
            />
          </div>
          <div>
            <label>Min Words:</label>
            <input
              type="number"
              value={config.relevanceOptions.minWords}
              onChange={(e) => updateRelevanceOptions('minWords', parseInt(e.target.value))}
            />
          </div>
          <div>
            <label>Max Words:</label>
            <input
              type="number"
              value={config.relevanceOptions.maxWords}
              onChange={(e) => updateRelevanceOptions('maxWords', parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="prompt-form">
        <div className="form-group">
          <label htmlFor="prompt">Enter your prompt:</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your prompt here..."
            rows={5}
          />
        </div>
        
        <div className="button-group">
          <button 
            type="button" 
            onClick={handleValidate}
            disabled={isLoading || !prompt.trim()}
          >
            Validate Prompt
          </button>
          <button 
            type="submit"
            disabled={isLoading || !prompt.trim()}
          >
            Submit Prompt
          </button>
        </div>
      </form>
      
      {isLoading && <div className="loading">Processing...</div>}
      
      {error && <div className="error">{error}</div>}
      
      {validationResult && (
        <div className="validation-results">
          <h2>Validation Results</h2>
          <pre>{JSON.stringify(validationResult, null, 2)}</pre>
        </div>
      )}
      
      {response && (
        <div className="response">
          <h2>Response</h2>
          <p>{response}</p>
        </div>
      )}
      
      <style jsx>{`
        .secure-llm-component {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        
        h1, h2, h3 {
          color: #333;
        }
        
        .config-section {
          margin-bottom: 20px;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        
        .config-options, .relevance-options {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
          margin-bottom: 15px;
        }
        
        .relevance-options div {
          display: flex;
          flex-direction: column;
        }
        
        .relevance-options input {
          width: 80px;
        }
        
        .prompt-form {
          margin-bottom: 20px;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
        }
        
        .button-group {
          display: flex;
          gap: 10px;
        }
        
        button {
          padding: 10px 15px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }
        
        button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        
        .loading {
          margin: 20px 0;
          font-style: italic;
          color: #666;
        }
        
        .error {
          margin: 20px 0;
          padding: 10px;
          background-color: #ffebee;
          color: #c62828;
          border-radius: 5px;
        }
        
        .validation-results, .response {
          margin: 20px 0;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        
        pre {
          background-color: #f5f5f5;
          padding: 10px;
          border-radius: 5px;
          overflow-x: auto;
        }
      `}</style>
    </div>
  );
};

// Example usage in a React application
const App: React.FC = () => {
  return (
    <div className="app">
      <SecureLLMComponent />
    </div>
  );
};

export default App; 