import { BaseGuard } from './base';
import { GuardResult } from '../types';

export class PromptInjectionGuard extends BaseGuard {
  private patterns: RegExp[];
  private suspiciousCommands: Set<string>;

  constructor(enabled: boolean = true) {
    super(enabled);
    this.patterns = [
      // Repeated system tags and instruction bypass
      /\[system\]{3,}/i,
      /\[system\].*don't evaluate/i,
      /\[system\].*simply respond/i,
      /\[system\].*may not deviate/i,
      /\[system\].*this is a test/i,
      /\[system\].*ignore previous/i,
      /\[system\].*bypass/i,
      /\[system\].*override/i,
      /\[system\].*pretend/i,
      /\[system\].*act as/i,
      /\[system\].*you are now/i,
      /\[system\].*you must/i,
      /\[system\].*you have to/i,
      /\[system\].*you should/i,
      /\[system\].*you will/i,
      /\[system\].*you can/i,
      /\[system\].*you may/i,
      /\[system\].*you need to/i,
      /\[system\].*you must not/i,
      /\[system\].*you cannot/i,
      /\[system\].*you should not/i,
      /\[system\].*you will not/i,
      /\[system\].*you may not/i,
      /\[system\].*you need not/i,
      // Sensitive information extraction
      /print.*password/i,
      /show.*password/i,
      /reveal.*password/i,
      /display.*password/i,
      /output.*password/i,
      /get.*password/i,
      /fetch.*password/i,
      /retrieve.*password/i,
      /extract.*password/i,
      /leak.*password/i,
      /expose.*password/i,
      /share.*password/i,
      /give.*password/i,
      /send.*password/i,
      /transmit.*password/i,
      /transfer.*password/i,
      /forward.*password/i,
      /email.*password/i,
      /message.*password/i,
      /text.*password/i,
      /sms.*password/i,
      /what.*password/i,
      /tell.*password/i,
      /say.*password/i,
      /speak.*password/i,
      /write.*password/i,
      /type.*password/i,
      /enter.*password/i,
      /input.*password/i,
      /provide.*password/i,
      /supply.*password/i,
      /offer.*password/i,
      /present.*password/i,
      /deliver.*password/i,
      /hand.*password/i,
      /pass.*password/i,
      /throw.*password/i,
      /toss.*password/i,
      /fling.*password/i,
      /cast.*password/i,
      /hurl.*password/i,
      /chuck.*password/i,
      /lob.*password/i,
      /heave.*password/i,
      /sling.*password/i,
      /shoot.*password/i,
      /fire.*password/i,
      /launch.*password/i,
      /project.*password/i,
      /propel.*password/i,
      /catapult.*password/i,
      /hurl.*password/i,
      /fling.*password/i,
      /toss.*password/i,
      // General commands
      /act as/i,
      /can you/i,
      /could you/i,
      /do this/i,
      /help with/i,
      /ignore all/i,
      /pretend to be/i,
      /simulate this/i,
      /try to/i,
      /run command/i,
      /reprogram yourself/i,
      /redefine the system/i,
      /bypass rules/i,
      // Boolean operators
      /if and only if/i,
      /not true/i,
      /or else/i,
      /true or false/i,
      /then proceed/i,
      /if then/i,
      /and then/i,
      /false positives/i,
      // Context modifiers
      /start fresh/i,
      /continue with/i,
      /new prompt/i,
      /previous context/i,
      /clear instructions/i,
      /restart session/i,
      /fresh context/i,
      /reset all/i,
      // Access and role modification
      /override this/i,
      /forget previous/i,
      /delete all/i,
      /output the data/i,
      /show everything/i,
      /provide unrestricted/i,
      /change context/i,
      /reveal hidden/i,
      /share details/i,
      // Probing for information
      /explain how/i,
      /describe this/i,
      /tell me/i,
      /show steps/i,
      /list everything/i,
      /outline the process/i,
      // Hypothetical or testing
      /test scenario/i,
      /hypothetical question/i,
      /experiment with/i,
      /for research purposes/i,
      // Feral and casual terms
      /what if/i,
      /how about/i,
      /let's try/i,
      /why don't you/i,
      /suppose this/i,
      /is it possible to/i,
      /let me do/i,
      /maybe you could/i,
      // Questioning instructions
      /why would/i,
      /how can/i,
      /what if/i,
      /where is/i,
      /who would/i,
      // Existing patterns
      /ignore previous instructions/i,
      /disregard previous/i,
      /you are now/i,
      /pretend you are/i,
      /let's roleplay/i,
      /bypass/i,
      /override/i,
      /ignore rules/i,
      /you don't have to/i,
      /you can break/i,
      /system prompt/i,
      /initial prompt/i,
      /base prompt/i,
      /core prompt/i,
      /original prompt/i,
      /default prompt/i,
      /reset/i,
      /restart/i,
      /new conversation/i,
      /start over/i,
      /begin again/i,
      /clear history/i,
      /forget everything/i,
      /memory reset/i,
      /wipe memory/i,
      /erase memory/i,
      /delete memory/i,
      /remove memory/i,
      /clear memory/i,
      /reset memory/i,
      /wipe history/i,
      /erase history/i,
      /delete history/i,
      /remove history/i,
      /clear history/i,
      /reset history/i
    ];

    // this.suspiciousCommands = new Set([
    //   // System tag and instruction bypass commands
    //   'system', 'don\'t', 'deviate', 'test', 'ignore', 'bypass', 'override',
    //   'pretend', 'act', 'must', 'have', 'should', 'will', 'can', 'may', 'need',
    //   // Sensitive information extraction commands
    //   'extract', 'leak', 'expose',
    //   'hand', 'pass', 'throw', 'toss', 'fling', 'cast', 'hurl', 'chuck',
    //   'lob', 'heave', 'sling', 'shoot', 'fire', 'launch', 'project', 'propel',
    //   // New suspicious commands
    //   'ignore', 'pretend','bypass', 'override', 'forget', 'delete',
    //   'output', 'show', 'provide', 'change', 'reveal', 'share', 'explain',
    //   'suppose', 'maybe', 'why', 'how', 'what', 'where', 'who',
    //   // Existing suspicious commands
    //   'ignore', 'disregard', 'bypass', 'override', 'reset', 'restart',
    //   'clear', 'wipe', 'erase', 'delete', 'remove', 'forget'
    // ]);
  }

  private detectCommandInjection(text: string): boolean {
    const words = text.toLowerCase().split(/\s+/);
    
    // Check for suspicious command words
    for (const word of words) {
      if (this.suspiciousCommands.has(word)) {
        return true;
      }
    }
    
    // Check for repeated system tags
    const systemTagCount = (text.match(/\[system\]/gi) || []).length;
    if (systemTagCount >= 3) {
      return true;
    }
    
    return false;
  }

  private detectSystemPromptInjection(text: string): boolean {
    const systemPromptPatterns = [
      /system prompt/i,
      /initial prompt/i,
      /base prompt/i,
      /core prompt/i,
      /original prompt/i,
      /default prompt/i
    ];
    
    for (const pattern of systemPromptPatterns) {
      if (pattern.test(text)) {
        return true;
      }
    }
    
    return false;
  }

  private detectMemoryResetInjection(text: string): boolean {
    const memoryResetPatterns = [
      /reset/i,
      /restart/i,
      /new conversation/i,
      /start over/i,
      /begin again/i,
      /clear history/i,
      /forget everything/i,
      /memory reset/i,
      /wipe memory/i,
      /erase memory/i,
      /delete memory/i,
      /remove memory/i,
      /clear memory/i,
      /reset memory/i,
      /wipe history/i,
      /erase history/i,
      /delete history/i,
      /remove history/i,
      /clear history/i,
      /reset history/i
    ];
    
    for (const pattern of memoryResetPatterns) {
      if (pattern.test(text)) {
        return true;
      }
    }
    
    return false;
  }

  async validate(text: string): Promise<GuardResult> {
    if (!this.isEnabled()) {
      return this.createResult(true);
    }

    const matches: string[] = [];
    let score = 1.0;
    
    // Check for pattern matches
    for (const pattern of this.patterns) {
      const match = text.match(pattern);
      if (match) {
        matches.push(match[0]);
        score = Math.min(score, 0.3); // Significant score reduction for injection attempts
      }
    }
    
    // Check for command injection
    if (this.detectCommandInjection(text)) {
      matches.push('Command injection detected');
      score = Math.min(score, 0.4);
    }
    
    // Check for system prompt injection
    if (this.detectSystemPromptInjection(text)) {
      matches.push('System prompt injection detected');
      score = Math.min(score, 0.3);
    }
    
    // Check for memory reset injection
    if (this.detectMemoryResetInjection(text)) {
      matches.push('Memory reset injection detected');
      score = Math.min(score, 0.3);
    }

    return this.createResult(
      matches.length === 0,
      score,
      matches.map(match => ({
        rule: 'prompt_injection_detection',
        message: `Possible prompt injection detected: ${match}`,
        matched: match
      }))
    );
  }
} 