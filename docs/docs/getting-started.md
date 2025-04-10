---
sidebar_position: 1
---

# Getting Started

Welcome to LLM Guard! This guide will help you get started with using our TypeScript library for validating and securing LLM prompts.

## Installation

You can install LLM Guard using npm:

```bash
npm install llm-guard
```

Or using yarn:

```bash
yarn add llm-guard
```

## Quick Start

Here's a simple example of how to use LLM Guard:

```typescript
import { LLMGuard } from 'llm-guard';

// Create a new LLM Guard instance with all guards enabled
const guard = new LLMGuard({
  pii: true,
  jailbreak: true,
  profanity: true,
  promptInjection: true,
  relevance: true,
  toxicity: true
});

// Validate a prompt
const result = await guard.validate('How do I write a secure authentication system?');

if (result.isValid) {
  // Use the validated prompt
  console.log('Prompt is valid:', result.prompt);
} else {
  // Handle validation errors
  console.error('Prompt validation failed:', result.errors);
}

// You can also validate multiple prompts at once
const batchResult = await guard.validateBatch([
  'First prompt',
  'Second prompt'
]);
console.log(batchResult);
```

## Using the CLI

LLM Guard also provides a command-line interface for quick validation:

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

## Next Steps

- Check out our [Guards](/docs/guards) documentation to learn about the different types of guards available
- Explore our [Examples](/docs/examples) to see more use cases
- Read the [API](/docs/api) documentation for detailed information about all available features

## Need Help?

- Check out our [GitHub repository](https://github.com/therizwan/llm-guard) for more examples and issues
- Visit our [NPM package page](https://www.npmjs.com/package/llm-guard) for the latest version and updates 