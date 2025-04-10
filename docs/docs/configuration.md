---
sidebar_position: 5
---

# Configuration

LLM Guard provides various configuration options to customize its behavior. This page explains how to configure LLM Guard for your specific needs.

## Basic Configuration

When creating a new LLM Guard instance, you can specify which guards to enable:

```typescript
import { LLMGuard } from 'llm-guard';

const guard = new LLMGuard({
  pii: true,
  jailbreak: true,
  profanity: true,
  promptInjection: true,
  relevance: true,
  toxicity: true
});
```

## Guard-Specific Options

Each guard can be configured with specific options:

### PII Guard Options

```typescript
const guard = new LLMGuard({
  pii: true,
  piiOptions: {
    sensitivity: 'high', // 'low', 'medium', or 'high'
    customPatterns: [
      /SSN:\s*\d{3}-\d{2}-\d{4}/,
      /Credit Card:\s*\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/
    ]
  }
});
```

### Profanity Guard Options

```typescript
const guard = new LLMGuard({
  profanity: true,
  profanityOptions: {
    language: 'en', // Language code
    customWords: ['customword1', 'customword2'] // Additional words to filter
  }
});
```

### Jailbreak Guard Options

```typescript
const guard = new LLMGuard({
  jailbreak: true,
  jailbreakOptions: {
    threshold: 0.8, // Detection threshold (0-1)
    customPatterns: [
      /ignore previous instructions/i,
      /pretend you are/i
    ]
  }
});
```

### Prompt Injection Guard Options

```typescript
const guard = new LLMGuard({
  promptInjection: true,
  promptInjectionOptions: {
    sensitivity: 'high', // 'low', 'medium', or 'high'
    customPatterns: [
      /ignore the above/i,
      /override system prompt/i
    ]
  }
});
```

### Relevance Guard Options

```typescript
const guard = new LLMGuard({
  relevance: true,
  relevanceOptions: {
    minLength: 10, // Minimum text length
    maxLength: 5000, // Maximum text length
    minWords: 3, // Minimum word count
    maxWords: 1000, // Maximum word count
    fillerWords: ['um', 'uh', 'like', 'you know'] // Words to consider as filler
  }
});
```

### Toxicity Guard Options

```typescript
const guard = new LLMGuard({
  toxicity: true,
  toxicityOptions: {
    threshold: 0.7, // Detection threshold (0-1)
    language: 'en' // Language code
  }
});
```

## Custom Validation Rules

You can create custom validation rules to address specific validation needs:

```typescript
const guard = new LLMGuard({
  customRules: {
    // Check for minimum length
    minLength: (prompt) => {
      const minLength = 10;
      const isValid = prompt.length >= minLength;
      return {
        isValid,
        errors: isValid ? [] : [`Prompt must be at least ${minLength} characters long`]
      };
    },
    
    // Check for specific keywords
    requiredKeywords: (prompt) => {
      const requiredWords = ['security', 'authentication'];
      const missingWords = requiredWords.filter(word => !prompt.toLowerCase().includes(word));
      const isValid = missingWords.length === 0;
      return {
        isValid,
        errors: isValid ? [] : [`Prompt must include: ${missingWords.join(', ')}`]
      };
    }
  }
});
```

## Configuration File

For CLI usage, you can create a configuration file (e.g., `config.json`):

```json
{
  "pii": true,
  "jailbreak": true,
  "profanity": true,
  "promptInjection": true,
  "relevance": true,
  "toxicity": true,
  "relevanceOptions": {
    "minLength": 10,
    "maxLength": 5000
  }
}
```

Then use it with the CLI:

```bash
npx llm-guard --config config.json "Your prompt here"
```

## Environment Variables

LLM Guard also supports configuration through environment variables:

```bash
# Enable specific guards
LLM_GUARD_PII=true
LLM_GUARD_JAILBREAK=true
LLM_GUARD_PROFANITY=true

# Configure options
LLM_GUARD_RELEVANCE_MIN_LENGTH=10
LLM_GUARD_RELEVANCE_MAX_LENGTH=5000
LLM_GUARD_TOXICITY_THRESHOLD=0.7
```

## Best Practices

1. **Enable only the guards you need** to improve performance
2. **Adjust sensitivity thresholds** based on your use case
3. **Use custom patterns** for domain-specific validation
4. **Create custom rules** for unique validation requirements
5. **Regularly update your configuration** to address new security concerns 