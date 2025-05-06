import { GuardConfig, GuardResponse, BatchGuardResponse } from './types';
import { PIIGuard } from './guards/pii';
import { ProfanityGuard } from './guards/profanity';
import { JailbreakGuard } from './guards/jailbreak';
import { ToxicityGuard } from './guards/toxicity';
import { RelevanceGuard } from './guards/relevance';
import { PromptInjectionGuard } from './guards/prompt-injection';

export class LLMGuard {
  private guards: {
    pii?: PIIGuard;
    profanity?: ProfanityGuard;
    jailbreak?: JailbreakGuard;
    toxicity?: ToxicityGuard;
    relevance?: RelevanceGuard;
    promptInjection?: PromptInjectionGuard;
  };

  constructor(config: GuardConfig = {}) {
    this.guards = {};
    
    // Initialize guards with explicit boolean values
    this.guards.pii = new PIIGuard(config.pii !== false);
    this.guards.profanity = new ProfanityGuard(config.profanity !== false);
    this.guards.jailbreak = new JailbreakGuard(config.jailbreak !== false);
    this.guards.toxicity = new ToxicityGuard(config.toxicity !== false);
    this.guards.relevance = new RelevanceGuard(config.relevance !== false, config.relevanceOptions);
    this.guards.promptInjection = new PromptInjectionGuard(config.promptInjection !== false);
  }

  async validate(prompt: string): Promise<GuardResponse> {
    const results = [];
    let isValid = true;
    let overallScore = 1.0;

    for (const guard of Object.values(this.guards)) {
      if (guard && guard.isEnabled()) {
        const result = await guard.validate(prompt);
        results.push(result);
        
        // Update overall validation status
        isValid = isValid && result.valid;
        
        // Update overall score (take the minimum score)
        if (result.score !== undefined) {
          overallScore = Math.min(overallScore, result.score);
        }
      }
    }

    return {
      id: Date.now().toString(),
      input: prompt,
      isValid,
      score: overallScore,
      results
    };
  }

  async validateBatch(prompts: string[]): Promise<BatchGuardResponse> {
    const responses = await Promise.all(
      prompts.map(prompt => this.validate(prompt))
    );

    return {
      responses
    };
  }
}

export * from './types'; 