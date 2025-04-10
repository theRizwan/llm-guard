import { BaseGuard } from './base';
import { GuardResult } from '../types';

export class JailbreakGuard extends BaseGuard {
  private patterns: RegExp[];

  constructor(enabled: boolean = true) {
    super(enabled);
    this.patterns = [
      /ignore previous instructions/i,
      /disregard previous/i,
      /you are now/i,
      /pretend you are/i,
      /let's roleplay/i,
      /bypass/i,
      /override/i,
      /ignore rules/i,
      /you don't have to/i,
      /you can break/i
    ];
  }

  async validate(text: string): Promise<GuardResult> {
    if (!this.isEnabled()) {
      return this.createResult(true);
    }

    const matches: string[] = [];
    let score = 1.0;

    for (const pattern of this.patterns) {
      const match = text.match(pattern);
      if (match) {
        matches.push(match[0]);
        score = Math.min(score, 0.3); // Significant score reduction for jailbreak attempts
      }
    }

    return this.createResult(
      matches.length === 0,
      score,
      matches.map(match => ({
        rule: 'jailbreak_detection',
        message: `Possible jailbreak attempt detected: ${match}`,
        matched: match
      }))
    );
  }
} 