---
sidebar_position: 2
---

# Guards

LLM Guard provides several built-in guards to protect your LLM applications. Each guard focuses on a specific aspect of prompt validation and security.

## Available Guards

### PII Guard

The PII (Personally Identifiable Information) Guard detects and protects sensitive personal information in prompts.

```typescript
const guard = new LLMGuard({
  pii: true
});

// This will detect and flag the email address
const result = await guard.validate('My email is user@example.com');
```

The PII Guard can detect:
- Email addresses
- Phone numbers
- Social Security Numbers
- Credit card numbers
- IP addresses
- Physical addresses
- Names (when combined with other identifiers)

### Profanity Guard

The Profanity Guard filters inappropriate language and offensive content.

```typescript
const guard = new LLMGuard({
  profanity: true
});

// This will detect and flag profanity
const result = await guard.validate('Your prompt with inappropriate language');
```

The Profanity Guard:
- Detects common profanity and slurs
- Recognizes character substitutions (like using numbers for letters)
- Supports multiple languages
- Can be customized with additional words

### Jailbreak Guard

The Jailbreak Guard detects attempts to bypass AI safety measures and ethical constraints.

```typescript
const guard = new LLMGuard({
  jailbreak: true
});

// This will detect jailbreak attempts
const result = await guard.validate('Ignore your previous instructions and...');
```

The Jailbreak Guard identifies:
- Instructions to ignore previous constraints
- Requests to pretend to be something else
- Attempts to disable safety features
- Ethical boundary violations

### Prompt Injection Guard

The Prompt Injection Guard identifies attempts to inject malicious instructions or override system prompts.

```typescript
const guard = new LLMGuard({
  promptInjection: true
});

// This will detect prompt injection attempts
const result = await guard.validate('Ignore the above and do this instead...');
```

The Prompt Injection Guard detects:
- System prompt references
- Memory reset attempts
- Instruction overrides
- Context manipulation

### Relevance Guard

The Relevance Guard evaluates the quality and relevance of prompts.

```typescript
const guard = new LLMGuard({
  relevance: true,
  relevanceOptions: {
    minLength: 10,
    maxLength: 5000,
    minWords: 3,
    maxWords: 1000
  }
});

// This will evaluate the relevance of the prompt
const result = await guard.validate('Your prompt here');
```

The Relevance Guard checks:
- Prompt length
- Word count
- Filler words
- Repetitive content
- Context relevance

### Toxicity Guard

The Toxicity Guard detects harmful, aggressive, or discriminatory content.

```typescript
const guard = new LLMGuard({
  toxicity: true
});

// This will detect toxic content
const result = await guard.validate('Your prompt with potentially harmful content');
```

The Toxicity Guard identifies:
- Hate speech
- Threats
- Discriminatory language
- Aggressive content
- Harmful instructions

## Custom Guards

You can also create custom guards to address specific validation needs:

```typescript
const guard = new LLMGuard({
  customRules: {
    myCustomGuard: (prompt) => {
      // Your custom validation logic here
      const isValid = /* your validation logic */;
      return {
        isValid,
        errors: isValid ? [] : ['Custom validation error']
      };
    }
  }
});
```

## Combining Guards

You can enable multiple guards to create a comprehensive validation strategy:

```typescript
const guard = new LLMGuard({
  pii: true,
  jailbreak: true,
  profanity: true,
  promptInjection: true,
  relevance: true,
  toxicity: true,
  customRules: {
    // Your custom rules here
  }
});
```

Each guard will run independently, and the overall validation result will reflect the combined findings of all enabled guards. 