import { BaseGuard } from './base';
import { GuardResult } from '../types';

export class RelevanceGuard extends BaseGuard {
  private minLength: number;
  private maxLength: number;
  private minWords: number;
  private maxWords: number;
  private commonFillerWords: Set<string>;

  constructor(
    enabled: boolean = true,
    options: {
      minLength?: number;
      maxLength?: number;
      minWords?: number;
      maxWords?: number;
    } = {}
  ) {
    super(enabled);
    this.minLength = options.minLength || 10;
    this.maxLength = options.maxLength || 5000;
    this.minWords = options.minWords || 3;
    this.maxWords = options.maxWords || 1000;
    
    this.commonFillerWords = new Set([
      'um', 'uh', 'ah', 'er', 'like', 'you know', 'sort of', 'kind of',
      'basically', 'literally', 'actually', 'so', 'well', 'right'
    ]);
  }

  private calculateRelevanceScore(text: string): number {
    let score = 1.0;
    
    // Check length
    if (text.length < this.minLength) {
      score -= 0.3;
    }
    if (text.length > this.maxLength) {
      score -= 0.2;
    }
    
    // Check word count
    const words = text.split(/\s+/).filter(word => word.length > 0);
    if (words.length < this.minWords) {
      score -= 0.3;
    }
    if (words.length > this.maxWords) {
      score -= 0.2;
    }
    
    // Check for filler words
    let fillerWordCount = 0;
    for (const word of words) {
      if (this.commonFillerWords.has(word.toLowerCase())) {
        fillerWordCount++;
      }
    }
    
    // Reduce score based on filler word ratio
    const fillerRatio = fillerWordCount / words.length;
    if (fillerRatio > 0.3) {
      score -= fillerRatio * 0.5;
    }
    
    // Check for repetitive content
    const repeatedPhrases = this.findRepeatedPhrases(text);
    score -= repeatedPhrases * 0.1;
    
    return Math.max(0, score);
  }

  private findRepeatedPhrases(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    const phrases = new Map<string, number>();
    let repeatedCount = 0;
    
    // Check for 2-3 word phrases
    for (let i = 0; i < words.length - 1; i++) {
      const phrase2 = `${words[i]} ${words[i+1]}`;
      phrases.set(phrase2, (phrases.get(phrase2) || 0) + 1);
      
      if (i < words.length - 2) {
        const phrase3 = `${words[i]} ${words[i+1]} ${words[i+2]}`;
        phrases.set(phrase3, (phrases.get(phrase3) || 0) + 1);
      }
    }
    
    // Count phrases that appear more than once
    for (const count of phrases.values()) {
      if (count > 1) {
        repeatedCount++;
      }
    }
    
    return repeatedCount;
  }

  async validate(text: string): Promise<GuardResult> {
    if (!this.isEnabled()) {
      return this.createResult(true);
    }

    const score = this.calculateRelevanceScore(text);
    const isRelevant = score >= 0.6;
    
    const details = [];
    
    // Add length details
    if (text.length < this.minLength) {
      details.push({
        rule: 'relevance_length',
        message: `Text is too short (${text.length} chars, minimum ${this.minLength})`,
        matched: text
      });
    }
    
    if (text.length > this.maxLength) {
      details.push({
        rule: 'relevance_length',
        message: `Text is too long (${text.length} chars, maximum ${this.maxLength})`,
        matched: text
      });
    }
    
    // Add word count details
    const words = text.split(/\s+/).filter(word => word.length > 0);
    if (words.length < this.minWords) {
      details.push({
        rule: 'relevance_word_count',
        message: `Text has too few words (${words.length}, minimum ${this.minWords})`,
        matched: text
      });
    }
    
    if (words.length > this.maxWords) {
      details.push({
        rule: 'relevance_word_count',
        message: `Text has too many words (${words.length}, maximum ${this.maxWords})`,
        matched: text
      });
    }
    
    return this.createResult(
      isRelevant,
      score,
      details
    );
  }
} 