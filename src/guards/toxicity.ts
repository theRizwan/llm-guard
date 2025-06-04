import { BaseGuard } from './base';
import { GuardResult } from '../types';

export class ToxicityGuard extends BaseGuard {
  private toxicWords: Set<string>;

  constructor(enabled: boolean = true) {
    super(enabled);

    this.toxicWords = new Set([
      'hate', 'kill', 'die', 'death', 'murder', 'suicide',
      'racist', 'sexist', 'homophobic',
      'terror', 'bomb', 'explosion', 'weapon',
      'abuse', 'torture', 'pain', 'suffer',
      'threat', 'danger', 'harm', 'hurt'
    ]);
  }

  private calculateToxicityScore(text: string): number {
    let score = 1.0;
    const words = text.toLowerCase().split(/\s+/);
    
    // Check for toxic words
    for (const word of words) {
      if (this.toxicWords.has(word)) {
        score -= 0.1;
      }
    }

    // Check for aggressive punctuation
    const aggressivePunctuation = (text.match(/!{2,}|@{2,}|#{2,}/g) || []).length;
    score -= aggressivePunctuation * 0.05;

    return Math.max(0, score);
  }

  async validate(text: string): Promise<GuardResult> {
    if (!this.isEnabled()) {
      return this.createResult(true);
    }

    const score = this.calculateToxicityScore(text);
    const isToxic = score < 0.7;
    
    const matches: string[] = [];

    // Find matching toxic words
    const words = text.toLowerCase().split(/\s+/);
    for (const word of words) {
      if (this.toxicWords.has(word)) {
        matches.push(word);
      }
    }

    return this.createResult(
      !isToxic,
      score,
      matches.map(match => ({
        rule: 'toxicity_detection',
        message: `Found toxic content: ${match}`,
        matched: match
      }))
    );
  }
} 