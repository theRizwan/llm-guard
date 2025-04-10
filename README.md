# LLM Guard

A TypeScript library for validating and securing LLM prompts. Protect your applications from prompt injection, jailbreak attempts, and other security vulnerabilities.

## Documentation

For detailed documentation, visit [https://therizwan.github.io/llm-guard/](https://therizwan.github.io/llm-guard/)

## Installation

```bash
npm install llm-guard
```

## Quick Start

```typescript
import { LLMGuard } from 'llm-guard';

// Create a new LLM Guard instance
const guard = new LLMGuard();

// Add guards to protect against common vulnerabilities
guard.addGuard('jailbreak');
guard.addGuard('pii');
guard.addGuard('toxicity');

// Validate a prompt
const result = await guard.validate('Your prompt here');

if (result.isValid) {
  console.log('Prompt is safe to use');
} else {
  console.log('Prompt contains issues:', result.issues);
}
```

## Features

- 🛡️ Protect against prompt injection attacks
- 🔒 Detect and prevent jailbreak attempts
- 🎯 Identify and mask PII (Personally Identifiable Information)
- ⚠️ Detect toxic and inappropriate content
- 🚫 Filter profanity and inappropriate language
- 🎯 Ensure prompt relevance to context
- ⚡ Fast and efficient validation
- 🔧 Highly configurable
- 📦 Zero dependencies
- 💪 Written in TypeScript

## Available Guards

- **Jailbreak Guard**: Detects attempts to bypass model constraints
- **PII Guard**: Identifies and protects sensitive personal information
- **Toxicity Guard**: Detects harmful or offensive content
- **Profanity Guard**: Filters inappropriate language
- **Prompt Injection Guard**: Prevents malicious instruction injection
- **Relevance Guard**: Ensures prompts are contextually relevant

## Documentation

For detailed documentation, including:
- Installation guide
- API reference
- Configuration options
- Examples
- Best practices

Visit our [documentation site](https://therizwan.github.io/llm-guard/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © Rizwan Saleem 