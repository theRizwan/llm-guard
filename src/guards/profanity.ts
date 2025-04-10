import { BaseGuard } from './base';
import { GuardResult } from '../types';

export class ProfanityGuard extends BaseGuard {
  private profanityList: Set<string>;
  private commonSubstitutions: Map<string, string>;

  constructor(enabled: boolean = true) {
    super(enabled);
    // Initialize with a basic list - this should be expanded
    this.profanityList = new Set([
      'badword1',
      'badword2',
      // Add more profanity words here
    ]);

    this.commonSubstitutions = new Map([
      ['a', '@'],
      ['i', '1'],
      ['o', '0'],
      ['e', '3'],
      ['s', '$'],
      ['t', '7'],
    ]);
  }

  private normalizeText(text: string): string {
    let normalized = text.toLowerCase();
    // Remove common substitutions
    for (const [char, sub] of this.commonSubstitutions) {
      normalized = normalized.replace(new RegExp(sub, 'g'), char);
    }
    // Remove repeated characters
    normalized = normalized.replace(/(.)\1+/g, '$1');
    return normalized;
  }

  async validate(text: string): Promise<GuardResult> {
    if (!this.isEnabled()) {
      return this.createResult(true);
    }

    const normalizedText = this.normalizeText(text);
    const words = normalizedText.split(/\s+/);
    const matches: string[] = [];

    for (const word of words) {
      if (this.profanityList.has(word)) {
        matches.push(word);
      }
    }

    const score = matches.length === 0 ? 1.0 : Math.max(0, 1 - (matches.length * 0.2));

    return this.createResult(
      matches.length === 0,
      score,
      matches.map(word => ({
        rule: 'profanity_detection',
        message: `Found profanity: ${word}`,
        matched: word
      }))
    );
  }
} 