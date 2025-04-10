---
id: api
title: API Reference
sidebar_position: 4
---

# API Reference

This page provides detailed information about the LLM Guard API.

## LLMGuard

The main class for validating and securing LLM prompts.

### Constructor

```typescript
new LLMGuard(options?: LLMGuardOptions)
```

#### Parameters

- `options` (optional): Configuration options for the LLM Guard instance.

```typescript
interface LLMGuardOptions {
  // Enable specific guards
  pii?: boolean;
  jailbreak?: boolean;
  profanity?: boolean;
  promptInjection?: boolean;
  relevance?: boolean;
  toxicity?: boolean;
  
  // Custom validation rules
  customRules?: Record<string, (prompt: string) => ValidationResult>;
  
  // Guard-specific options
  relevanceOptions?: RelevanceOptions;
  piiOptions?: PIIOptions;
  // ... other guard-specific options
}
```

### Methods

#### validate

Validates a single prompt.

```typescript
async validate(prompt: string): Promise<ValidationResult>
```

##### Parameters

- `prompt`: The prompt to validate.

##### Returns

A `ValidationResult` object containing the validation status and any errors.

```typescript
interface ValidationResult {
  isValid: boolean;
  prompt: string;
  errors: string[];
}
```

#### validateBatch

Validates multiple prompts at once.

```typescript
async validateBatch(prompts: string[]): Promise<ValidationResult[]>
```

##### Parameters

- `prompts`: An array of prompts to validate.

##### Returns

An array of `ValidationResult` objects, one for each prompt.

## Guards

### PII Guard

Detects personally identifiable information.

```typescript
interface PIIOptions {
  sensitivity?: 'low' | 'medium' | 'high';
  customPatterns?: RegExp[];
}
```

### Profanity Guard

Filters inappropriate language.

```typescript
interface ProfanityOptions {
  language?: string;
  customWords?: string[];
}
```

### Jailbreak Guard

Detects attempts to bypass AI safety measures.

```typescript
interface JailbreakOptions {
  threshold?: number;
  customPatterns?: RegExp[];
}
```

### Prompt Injection Guard

Identifies attempts to inject malicious instructions.

```typescript
interface PromptInjectionOptions {
  sensitivity?: 'low' | 'medium' | 'high';
  customPatterns?: RegExp[];
}
```

### Relevance Guard

Evaluates the quality and relevance of prompts.

```typescript
interface RelevanceOptions {
  minLength?: number;
  maxLength?: number;
  minWords?: number;
  maxWords?: number;
  fillerWords?: string[];
}
```

### Toxicity Guard

Detects harmful or aggressive content.

```typescript
interface ToxicityOptions {
  threshold?: number;
  language?: string;
}
```

## CLI

LLM Guard provides a command-line interface for quick validation.

### Usage

```bash
npx llm-guard [options] <prompt>
```

### Options

- `--pii`: Enable PII detection
- `--jailbreak`: Enable jailbreak detection
- `--profanity`: Enable profanity filtering
- `--prompt-injection`: Enable prompt injection detection
- `--relevance`: Enable relevance checking
- `--toxicity`: Enable toxicity detection
- `--config <file>`: Use a configuration file
- `--batch`: Run in batch mode
- `--batch-file <file>`: Process prompts from a file
- `--help`: Show help information

### Configuration File

You can use a JSON configuration file to specify options:

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

## Types

### ValidationResult

```typescript
interface ValidationResult {
  isValid: boolean;
  prompt: string;
  errors: string[];
}
```

### LLMGuardOptions

```typescript
interface LLMGuardOptions {
  pii?: boolean;
  jailbreak?: boolean;
  profanity?: boolean;
  promptInjection?: boolean;
  relevance?: boolean;
  toxicity?: boolean;
  customRules?: Record<string, (prompt: string) => ValidationResult>;
  relevanceOptions?: RelevanceOptions;
  piiOptions?: PIIOptions;
  profanityOptions?: ProfanityOptions;
  jailbreakOptions?: JailbreakOptions;
  promptInjectionOptions?: PromptInjectionOptions;
  toxicityOptions?: ToxicityOptions;
}
```

## Error Handling

LLM Guard throws specific error types for different scenarios:

```typescript
class ValidationError extends Error {
  constructor(message: string, public result: ValidationResult) {
    super(message);
    this.name = 'ValidationError';
  }
}

class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}
```

## Examples

### Basic Usage

```typescript
import { LLMGuard } from 'llm-guard';

const guard = new LLMGuard({
  pii: true,
  jailbreak: true
});

const result = await guard.validate('My email is user@example.com');
console.log(result);
```

### Custom Validation Rules

```typescript
import { LLMGuard } from 'llm-guard';

const guard = new LLMGuard({
  customRules: {
    minLength: (prompt) => {
      const minLength = 10;
      const isValid = prompt.length >= minLength;
      return {
        isValid,
        errors: isValid ? [] : [`Prompt must be at least ${minLength} characters long`]
      };
    }
  }
});

const result = await guard.validate('Short');
console.log(result);
```

### Batch Validation

```typescript
import { LLMGuard } from 'llm-guard';

const guard = new LLMGuard();
const prompts = ['First prompt', 'Second prompt'];
const results = await guard.validateBatch(prompts);
console.log(results);
``` 