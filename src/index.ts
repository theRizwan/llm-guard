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
    
    if (config.pii !== false) {
      this.guards.pii = new PIIGuard(config.pii);
    }
    
    if (config.profanity !== false) {
      this.guards.profanity = new ProfanityGuard(config.profanity);
    }
    
    if (config.jailbreak !== false) {
      this.guards.jailbreak = new JailbreakGuard(config.jailbreak);
    }
    
    if (config.toxicity !== false) {
      this.guards.toxicity = new ToxicityGuard(config.toxicity);
    }
    
    if (config.relevance !== false) {
      this.guards.relevance = new RelevanceGuard(config.relevance, config.relevanceOptions);
    }
    
    if (config.promptInjection !== false) {
      this.guards.promptInjection = new PromptInjectionGuard(config.promptInjection);
    }
  }

  async validate(prompt: string): Promise<GuardResponse> {
    const results = [];
    let overallScore = 1.0;

    for (const guard of Object.values(this.guards)) {
      if (guard && guard.isEnabled()) {
        const result = await guard.validate(prompt);
        results.push(result);
        overallScore = Math.min(overallScore, result.score || 1.0);
      }
    }

    return {
      id: Date.now().toString(),
      input: prompt,
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