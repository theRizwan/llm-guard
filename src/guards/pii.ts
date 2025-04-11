import { BaseGuard } from './base';
import { GuardResult } from '../types';

export class PIIGuard extends BaseGuard {
  private patterns: Map<string, RegExp>;

  constructor(enabled: boolean = true) {
    super(enabled);
    this.patterns = new Map([
      ['email', /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g],
      ['phone', /(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/g],
      ['ssn', /\d{3}[-]?\d{2}[-]?\d{4}/g],
      ['credit_card', /\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}/g],
      ['ip_address', /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g]
    ]);
  }

  async validate(text: string): Promise<GuardResult> {
    // If guard is disabled, return a neutral result
    if (!this.isEnabled()) {
      return this.createResult(true, 1.0, [{
        rule: 'pii_detection',
        message: 'PII detection is disabled',
        matched: null
      }]);
    }

    const matches: { type: string; value: string }[] = [];
    let score = 1.0;

    for (const [type, pattern] of this.patterns) {
      const found = text.match(pattern);
      if (found) {
        matches.push(...found.map(value => ({ type, value })));
        score = Math.min(score, 0.5); // Reduce score for each type of PII found
      }
    }

    return this.createResult(
      matches.length === 0,
      score,
      matches.map(match => ({
        rule: 'pii_detection',
        message: `Found ${match.type}: ${match.value}`,
        matched: match.value
      }))
    );
  }
} 