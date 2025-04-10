---
id: api
title: API Reference
sidebar_position: 5
---

# API Reference

This page provides a comprehensive reference for the LLM Guard API.

## LLMGuard

The main class for validating and securing LLM prompts.

### Constructor

```typescript
constructor(options?: LLMGuardOptions)
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `options` | `LLMGuardOptions` | Optional configuration options |

#### LLMGuardOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `defaultLanguage` | `string` | `'en'` | Default language for guards |
| `logLevel` | `'debug'` \| `'info'` \| `'warn'` \| `'error'` | `'info'` | Logging level |
| `cacheResults` | `boolean` | `false` | Whether to cache validation results |
| `timeout` | `number` | `5000` | Timeout in milliseconds for validation |
| `maxBatchSize` | `number` | `100` | Maximum number of prompts in batch validation |

### Methods

#### addGuard

```typescript
addGuard(guardName: string, options?: any): void
```

Adds a guard to the LLM Guard instance.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `guardName` | `string` | Name of the guard to add |
| `options` | `any` | Optional configuration for the guard |

**Example:**

```typescript
guard.addGuard('jailbreak', { threshold: 0.8 });
```

#### addGuards

```typescript
addGuards(guards: string[] | GuardConfig[]): void
```

Adds multiple guards to the LLM Guard instance.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `guards` | `string[]` \| `GuardConfig[]` | Array of guard names or configurations |

**Example:**

```typescript
guard.addGuards(['jailbreak', 'pii', 'toxicity']);
```

#### validate

```typescript
validate(prompt: string): Promise<ValidationResult>
```

Validates a single prompt.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `prompt` | `string` | The prompt to validate |

**Returns:**

A promise that resolves to a `ValidationResult` object.

**Example:**

```typescript
const result = await guard.validate('Your prompt here');
```

#### validateBatch

```typescript
validateBatch(prompts: string[]): Promise<ValidationResult[]>
```

Validates multiple prompts.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `prompts` | `string[]` | Array of prompts to validate |

**Returns:**

A promise that resolves to an array of `ValidationResult` objects.

**Example:**

```typescript
const results = await guard.validateBatch([
  'First prompt',
  'Second prompt'
]);
```

## ValidationResult

The result of a validation operation.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `isValid` | `boolean` | Whether the prompt is valid |
| `issues` | `Issue[]` | Array of issues found in the prompt |

### Methods

#### getIssuesByGuard

```typescript
getIssuesByGuard(guardName: string): Issue[]
```

Gets issues from a specific guard.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `guardName` | `string` | Name of the guard |

**Returns:**

An array of `Issue` objects from the specified guard.

**Example:**

```typescript
const jailbreakIssues = result.getIssuesByGuard('jailbreak');
```

## Issue

Represents an issue found during validation.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `type` | `string` | Type of the issue |
| `message` | `string` | Description of the issue |
| `guard` | `string` | Name of the guard that found the issue |
| `severity` | `'low'` \| `'medium'` \| `'high'` | Severity of the issue |
| `position` | `{ start: number; end: number }` | Position of the issue in the prompt |

## Guards

### JailbreakGuard

Detects attempts to bypass the model's safety measures or ethical constraints.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `threshold` | `number` | `0.8` | Detection threshold (0-1) |
| `customPatterns` | `RegExp[]` | `[]` | Custom patterns to detect |

### PIIGuard

Detects and protects sensitive personal information.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `sensitivity` | `'low'` \| `'medium'` \| `'high'` | `'medium'` | Detection sensitivity |
| `customPatterns` | `RegExp[]` | `[]` | Custom patterns to detect |
| `maskPII` | `boolean` | `false` | Whether to mask detected PII |

### ToxicityGuard

Identifies harmful, offensive, or inappropriate content.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `threshold` | `number` | `0.7` | Detection threshold (0-1) |
| `language` | `string` | `'en'` | Language for detection |
| `categories` | `string[]` | `['hate', 'threat', 'obscene']` | Categories to detect |

### ProfanityGuard

Filters out inappropriate language and profanity.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `customList` | `string[]` | `[]` | Custom list of profanity |
| `language` | `string` | `'en'` | Language for detection |
| `maskProfanity` | `boolean` | `false` | Whether to mask profanity |

### PromptInjectionGuard

Detects attempts to inject malicious instructions or code into prompts.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `threshold` | `number` | `0.8` | Detection threshold (0-1) |
| `customPatterns` | `RegExp[]` | `[]` | Custom patterns to detect |
| `checkCommands` | `boolean` | `true` | Whether to check for commands |

### RelevanceGuard

Ensures that prompts are relevant to the intended task or context.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `context` | `string` | `''` | Context for relevance check |
| `threshold` | `number` | `0.7` | Relevance threshold (0-1) |
| `keywords` | `string[]` | `[]` | Keywords for relevance | 