# llm-guard

<div align="center">
  <img src="assets/llm-guard-logo.png" alt="LLM Guard Logo" width="600">
  <p><em>Secure your LLM prompts with confidence</em></p>
</div>

A TypeScript library for validating and securing LLM prompts. This package provides various guards to protect against common LLM vulnerabilities and misuse.

[![npm version](https://badge.fury.io/js/llm-guard.svg)](https://badge.fury.io/js/llm-guard)
[![GitHub license](https://img.shields.io/github/license/theRizwan/llm-guard)](https://github.com/theRizwan/llm-guard/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/theRizwan/llm-guard)](https://github.com/theRizwan/llm-guard/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/theRizwan/llm-guard)](https://github.com/theRizwan/llm-guard/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/theRizwan/llm-guard)](https://github.com/theRizwan/llm-guard/pulls)

## Features

- Validate LLM prompts for various security concerns
- Support for multiple validation rules:
  - PII detection
  - Jailbreak detection
  - Profanity filtering
  - Prompt injection detection
  - Relevance checking
  - Toxicity detection
- Batch validation support
- CLI interface
- TypeScript support

## Installation

```bash
npm install llm-guard
```

## Usage

### JavaScript/TypeScript

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

// Single prompt validation
const result = await guard.validate('Your prompt here');
console.log(result);

// Batch validation
const batchResult = await guard.validateBatch([
  'First prompt',
  'Second prompt'
]);
console.log(batchResult);
```

### CLI

```bash
# Basic usage
npx llm-guard "Your prompt here"

# With specific guards enabled
npx llm-guard --pii --jailbreak "Your prompt here"

# With a config file
npx llm-guard --config config.json "Your prompt here"

# Batch mode
npx llm-guard --batch '["First prompt", "Second prompt"]'

# Show help
npx llm-guard --help
```

## Configuration

You can configure which validators to enable when creating the LLMGuard instance:

```typescript
const guard = new LLMGuard({
  pii: true,              // Enable PII detection
  jailbreak: true,        // Enable jailbreak detection
  profanity: true,        // Enable profanity filtering
  promptInjection: true,  // Enable prompt injection detection
  relevance: true,        // Enable relevance checking
  toxicity: true,         // Enable toxicity detection
  customRules: {          // Add custom validation rules
    // Your custom rules here
  },
  relevanceOptions: {     // Configure relevance guard options
    minLength: 10,        // Minimum text length
    maxLength: 5000,      // Maximum text length
    minWords: 3,          // Minimum word count
    maxWords: 1000        // Maximum word count
  }
});
```

## Available Guards

### PII Guard
Detects personally identifiable information like emails, phone numbers, SSNs, credit card numbers, and IP addresses.

### Profanity Guard
Filters profanity and offensive language, including common character substitutions (like using numbers for letters).

### Jailbreak Guard
Detects attempts to bypass AI safety measures and ethical constraints, such as "ignore previous instructions" or "pretend you are".

### Prompt Injection Guard
Identifies attempts to inject malicious instructions or override system prompts, including system prompt references and memory reset attempts.

### Relevance Guard
Evaluates the relevance and quality of the prompt based on length, word count, filler words, and repetitive content.

### Toxicity Guard
Detects toxic, harmful, or aggressive content, including hate speech, threats, and discriminatory language.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request on GitHub. We appreciate any help with:

- Bug fixes
- New features
- Documentation improvements
- Code quality enhancements
- Test coverage
- Performance optimizations

### How to Contribute

1. Fork the repository on GitHub
2. Create a new branch for your feature or bugfix
3. Make your changes
4. Write or update tests as needed
5. Ensure all tests pass
6. Submit a Pull Request with a clear description of the changes

For more complex changes, please open an issue first to discuss the proposed changes.

## License

MIT 