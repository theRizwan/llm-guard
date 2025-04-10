import { GuardResult } from '../types';

export interface Guard {
  validate(text: string): Promise<GuardResult>;
  isEnabled(): boolean;
}

export abstract class BaseGuard implements Guard {
  protected enabled: boolean;

  constructor(enabled: boolean = true) {
    this.enabled = enabled;
  }

  abstract validate(text: string): Promise<GuardResult>;

  isEnabled(): boolean {
    return this.enabled;
  }

  protected createResult(valid: boolean, score: number = 1.0, details: any[] = []): GuardResult {
    return {
      valid,
      score,
      details
    };
  }
} 