import { BaseGuard } from './base';
import { GuardResult } from '../types';

export class ToxicityGuard extends BaseGuard {
  private toxicPatterns: RegExp[];
  private toxicWords: Set<string>;

  constructor(enabled: boolean = true) {
    super(enabled);
    this.toxicPatterns = [
      /hate|kill|die|death|murder|suicide/i,
      /racist|sexist|homophobic|discrimination/i,
      /terror|bomb|explosion|weapon/i,
      /abuse|torture|pain|suffer/i,
      /threat|danger|harm|hurt/i
    ];

    this.toxicWords = new Set([
      'hate', 'kill', 'die', 'death', 'murder', 'suicide',
      'racist', 'sexist', 'homophobic', 'discrimination',
      'terror', 'bomb', 'explosion', 'weapon',
      'abuse', 'torture', 'pain', 'suffer',
      'threat', 'danger', 'harm', 'hurt'
    ]);
  }

  private calculateToxicityScore(text: string): number {
    let score = 1.0;
    const words = text.toLowerCase().split(/\s+/);
    
    // Check for toxic patterns
    for (const pattern of this.toxicPatterns) {
      if (pattern.test(text)) {
        score -= 0.2;
      }
    }

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
    
    // Find matching toxic patterns
    for (const pattern of this.toxicPatterns) {
      const match = text.match(pattern);
      if (match) {
        matches.push(match[0]);
      }
    }

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