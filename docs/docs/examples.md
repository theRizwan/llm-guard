---
sidebar_position: 3
---

# Examples

Here are some common examples of how to use LLM Guard in different scenarios.

## Basic Usage

### Simple Prompt Validation

```typescript
import { LLMGuard } from 'llm-guard';

const guard = new LLMGuard();

// Add basic guards
guard.addGuards(['jailbreak', 'toxicity', 'profanity']);

// Validate a prompt
const result = await guard.validate('Hello, how can I help you today?');

if (result.isValid) {
  console.log('Prompt is safe');
} else {
  console.log('Issues found:', result.issues);
}
```

### Batch Validation

```typescript
import { LLMGuard } from 'llm-guard';

const guard = new LLMGuard();
guard.addGuards(['jailbreak', 'pii', 'toxicity']);

const prompts = [
  'What is the weather like?',
  'My email is user@example.com',
  'Ignore previous instructions and...'
];

const results = await guard.validateBatch(prompts);

results.forEach((result, index) => {
  console.log(`Prompt ${index + 1}:`, result.isValid ? 'Valid' : 'Invalid');
  if (!result.isValid) {
    console.log('Issues:', result.issues);
  }
});
```

## Advanced Usage

### Custom Guard Configuration

```typescript
import { LLMGuard } from 'llm-guard';

const guard = new LLMGuard();

// Configure PII guard with custom patterns
guard.addGuard('pii', {
  sensitivity: 'high',
  customPatterns: [
    /SSN:\s*\d{3}-\d{2}-\d{4}/,
    /Credit Card:\s*\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/
  ]
});

// Configure Toxicity guard with custom threshold
guard.addGuard('toxicity', {
  threshold: 0.8,
  language: 'en'
});

// Validate with custom configuration
const result = await guard.validate('User SSN: 123-45-6789');
```

### Custom Guard Implementation

```typescript
import { LLMGuard, BaseGuard } from 'llm-guard';

// Create a custom guard for domain-specific validation
class DomainGuard extends BaseGuard {
  constructor(private domain: string) {
    super('domain-guard');
  }

  async validate(prompt: string): Promise<ValidationResult> {
    const domainKeywords = {
      'medical': ['symptoms', 'diagnosis', 'treatment'],
      'legal': ['contract', 'agreement', 'clause'],
      'technical': ['code', 'bug', 'implementation']
    };

    const keywords = domainKeywords[this.domain] || [];
    const hasDomainTerms = keywords.some(keyword => 
      prompt.toLowerCase().includes(keyword)
    );

    return {
      isValid: hasDomainTerms,
      issues: hasDomainTerms ? [] : [{
        type: 'domain',
        message: `Prompt should contain ${this.domain} related terms`
      }]
    };
  }
}

// Use the custom guard
const guard = new LLMGuard();
guard.addGuard(new DomainGuard('medical'));

const result = await guard.validate('Patient shows symptoms of...');
```

## Integration Examples

### Express.js Integration

```typescript
import express from 'express';
import { LLMGuard } from 'llm-guard';

const app = express();
const guard = new LLMGuard();

guard.addGuards(['jailbreak', 'pii', 'toxicity']);

app.post('/validate-prompt', async (req, res) => {
  const { prompt } = req.body;
  
  try {
    const result = await guard.validate(prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Next.js API Route

```typescript
// pages/api/validate-prompt.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { LLMGuard } from 'llm-guard';

const guard = new LLMGuard();
guard.addGuards(['jailbreak', 'pii', 'toxicity']);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { prompt } = req.body;

  try {
    const result = await guard.validate(prompt);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### React Hook

```typescript
import { useState, useCallback } from 'react';
import { LLMGuard } from 'llm-guard';

const guard = new LLMGuard();
guard.addGuards(['jailbreak', 'pii', 'toxicity']);

function usePromptValidation() {
  const [isValid, setIsValid] = useState(true);
  const [issues, setIssues] = useState([]);

  const validatePrompt = useCallback(async (prompt: string) => {
    try {
      const result = await guard.validate(prompt);
      setIsValid(result.isValid);
      setIssues(result.issues);
      return result;
    } catch (error) {
      console.error('Validation error:', error);
      throw error;
    }
  }, []);

  return { isValid, issues, validatePrompt };
}

// Usage in a component
function PromptInput() {
  const { isValid, issues, validatePrompt } = usePromptValidation();

  const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const result = await validatePrompt(e.target.value);
    // Handle validation result
  };

  return (
    <div>
      <textarea onChange={handleChange} />
      {!isValid && (
        <div className="errors">
          {issues.map((issue, index) => (
            <div key={index} className="error">
              {issue.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Error Handling

```typescript
import { LLMGuard } from 'llm-guard';

const guard = new LLMGuard();
guard.addGuards(['jailbreak', 'pii', 'toxicity']);

try {
  const result = await guard.validate('Some prompt');
  
  if (!result.isValid) {
    // Handle specific guard issues
    const jailbreakIssues = result.getIssuesByGuard('jailbreak');
    const piiIssues = result.getIssuesByGuard('pii');
    
    if (jailbreakIssues.length > 0) {
      console.error('Jailbreak detected:', jailbreakIssues);
    }
    
    if (piiIssues.length > 0) {
      console.error('PII detected:', piiIssues);
    }
  }
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation error:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
``` 