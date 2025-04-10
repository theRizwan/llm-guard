---
sidebar_position: 1
---

# Getting Started

LLM Guard is a TypeScript library designed to help you validate and secure your LLM prompts. It provides a comprehensive set of guards to protect against common vulnerabilities and ensure the quality of your prompts.

## Installation

You can install LLM Guard using npm:

```bash
npm install llm-guard
```

## Quick Start

Here's a simple example of how to use LLM Guard:

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

## Basic Usage

### Creating a Guard

```typescript
import { LLMGuard } from 'llm-guard';

const guard = new LLMGuard();
```

### Adding Guards

LLM Guard provides several built-in guards:

```typescript
// Add individual guards
guard.addGuard('jailbreak');
guard.addGuard('pii');
guard.addGuard('toxicity');
guard.addGuard('profanity');
guard.addGuard('prompt-injection');
guard.addGuard('relevance');

// Or add multiple guards at once
guard.addGuards(['jailbreak', 'pii', 'toxicity']);
```

### Validating Prompts

```typescript
// Validate a single prompt
const result = await guard.validate('Your prompt here');

// Validate multiple prompts
const results = await guard.validateBatch([
  'First prompt',
  'Second prompt',
  'Third prompt'
]);
```

### Handling Results

```typescript
const result = await guard.validate('Your prompt here');

if (result.isValid) {
  // Prompt is safe to use
  console.log('Prompt is valid');
} else {
  // Prompt contains issues
  console.log('Issues found:', result.issues);
  
  // Get specific issues
  const jailbreakIssues = result.getIssuesByGuard('jailbreak');
  const piiIssues = result.getIssuesByGuard('pii');
}
```

## Next Steps

- Learn about the [available guards](/docs/guards)
- Check out the [API reference](/docs/api)
- See [examples](/docs/examples) of common use cases
- Read about [advanced configuration](/docs/configuration) 