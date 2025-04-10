---
sidebar_position: 4
---

# Configuration

LLM Guard provides various configuration options to customize its behavior. This guide covers all available configuration options and how to use them.

## Global Configuration

When creating a new LLMGuard instance, you can provide global configuration options:

```typescript
import { LLMGuard } from 'llm-guard';

const guard = new LLMGuard({
  // Global configuration options
  defaultLanguage: 'en',
  logLevel: 'info',
  cacheResults: true,
  timeout: 5000
});
```

### Available Global Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `defaultLanguage` | string | 'en' | Default language for guards |
| `logLevel` | 'debug' \| 'info' \| 'warn' \| 'error' | 'info' | Logging level |
| `cacheResults` | boolean | false | Whether to cache validation results |
| `timeout` | number | 5000 | Timeout in milliseconds for validation |
| `maxBatchSize` | number | 100 | Maximum number of prompts in batch validation |

## Guard-Specific Configuration

Each guard can be configured with specific options when adding it:

```typescript
// Configure individual guards
guard.addGuard('jailbreak', {
  threshold: 0.8,
  customPatterns: [/pattern1/, /pattern2/]
});

guard.addGuard('pii', {
  sensitivity: 'high',
  customPatterns: [/SSN/, /EMAIL/]
});

// Configure multiple guards at once
guard.addGuards([
  {
    name: 'toxicity',
    options: {
      threshold: 0.7,
      language: 'en'
    }
  },
  {
    name: 'profanity',
    options: {
      customList: ['word1', 'word2']
    }
  }
]);
```

### Guard Configuration Options

#### Jailbreak Guard

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `threshold` | number | 0.8 | Detection threshold (0-1) |
| `customPatterns` | RegExp[] | [] | Custom patterns to detect |

#### PII Guard

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `sensitivity` | 'low' \| 'medium' \| 'high' | 'medium' | Detection sensitivity |
| `customPatterns` | RegExp[] | [] | Custom patterns to detect |
| `maskPII` | boolean | false | Whether to mask detected PII |

#### Toxicity Guard

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `threshold` | number | 0.7 | Detection threshold (0-1) |
| `language` | string | 'en' | Language for detection |
| `categories` | string[] | ['hate', 'threat', 'obscene'] | Categories to detect |

#### Profanity Guard

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `customList` | string[] | [] | Custom list of profanity |
| `language` | string | 'en' | Language for detection |
| `maskProfanity` | boolean | false | Whether to mask profanity |

#### Prompt Injection Guard

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `threshold` | number | 0.8 | Detection threshold (0-1) |
| `customPatterns` | RegExp[] | [] | Custom patterns to detect |
| `checkCommands` | boolean | true | Whether to check for commands |

#### Relevance Guard

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `context` | string | '' | Context for relevance check |
| `threshold` | number | 0.7 | Relevance threshold (0-1) |
| `keywords` | string[] | [] | Keywords for relevance |

## Advanced Configuration

### Custom Guard Configuration

When creating custom guards, you can define your own configuration options:

```typescript
import { BaseGuard } from 'llm-guard';

interface CustomGuardOptions {
  sensitivity: 'low' | 'medium' | 'high';
  customRules: string[];
}

class CustomGuard extends BaseGuard {
  constructor(options: CustomGuardOptions) {
    super('custom-guard', options);
  }

  async validate(prompt: string): Promise<ValidationResult> {
    const { sensitivity, customRules } = this.options as CustomGuardOptions;
    // Implementation
  }
}
```

### Environment Configuration

You can use environment variables to configure LLM Guard:

```typescript
import { LLMGuard } from 'llm-guard';

const guard = new LLMGuard({
  defaultLanguage: process.env.LLM_GUARD_LANGUAGE || 'en',
  logLevel: process.env.LLM_GUARD_LOG_LEVEL || 'info',
  timeout: parseInt(process.env.LLM_GUARD_TIMEOUT || '5000')
});
```

### Configuration File

You can load configuration from a file:

```typescript
import { LLMGuard } from 'llm-guard';
import config from './llm-guard.config.json';

const guard = new LLMGuard(config);
```

Example `llm-guard.config.json`:
```json
{
  "defaultLanguage": "en",
  "logLevel": "info",
  "guards": {
    "jailbreak": {
      "threshold": 0.8
    },
    "pii": {
      "sensitivity": "high"
    }
  }
}
```

## Best Practices

1. **Start with Default Configuration**
   - Begin with default settings and adjust based on your needs
   - Test thoroughly after each configuration change

2. **Use Appropriate Thresholds**
   - Higher thresholds (0.8-0.9) for critical guards like jailbreak
   - Lower thresholds (0.6-0.7) for less critical guards

3. **Language Support**
   - Always specify the language when working with non-English content
   - Use appropriate language models for each supported language

4. **Performance Considerations**
   - Enable caching for frequently validated prompts
   - Adjust batch size based on your use case
   - Set appropriate timeouts for your environment

5. **Security**
   - Keep sensitive configuration in environment variables
   - Regularly update custom patterns and rules
   - Monitor and log validation results 