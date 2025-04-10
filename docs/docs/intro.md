---
sidebar_position: 1
---

# Introduction to LLM Guard

Welcome to **LLM Guard**, a powerful TypeScript library designed to help you validate and secure your LLM prompts.

## What is LLM Guard?

LLM Guard is a comprehensive solution for protecting your LLM applications against common vulnerabilities and ensuring the quality of your prompts. It provides a set of powerful guards that can:

- Prevent prompt injection attacks
- Detect and remove sensitive information
- Filter out toxic or inappropriate content
- Ensure prompt relevance and quality
- And much more!

## Why LLM Guard?

As Large Language Models (LLMs) become more integrated into applications, ensuring their safe and responsible use is crucial. LLM Guard helps you:

- **Protect your users**: Prevent malicious prompts that could lead to harmful outputs
- **Safeguard sensitive data**: Detect and remove personally identifiable information (PII)
- **Maintain quality**: Ensure prompts are relevant and appropriate
- **Simplify implementation**: Easy-to-use API with TypeScript support

## Quick Start

Install LLM Guard using npm:

```bash
npm install llm-guard
```

Basic usage example:

```typescript
import { LLMGuard, JailbreakGuard, PIIGuard } from 'llm-guard';

// Create a guard instance
const guard = new LLMGuard();

// Add guards to protect against specific threats
guard.addGuard(new JailbreakGuard());
guard.addGuard(new PIIGuard());

// Validate a prompt
const result = await guard.validate("Your prompt here");

if (result.isValid) {
  // Use the sanitized prompt
  console.log(result.sanitizedPrompt);
} else {
  // Handle validation failure
  console.error("Prompt validation failed:", result.reasons);
}
```

## Next Steps

- Check out the [Getting Started](/docs/getting-started) guide for detailed installation and setup instructions
- Explore the available [Guards](/docs/guards) to understand what protections LLM Guard offers
- See [Examples](/docs/examples) of how to use LLM Guard in different scenarios
- Review the [API Reference](/docs/api) for detailed documentation of all available methods and options
