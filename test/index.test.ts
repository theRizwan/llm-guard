import { LLMGuard } from '../src';

describe('LLMGuard', () => {
  let guard: LLMGuard;

  beforeEach(() => {
    guard = new LLMGuard({
      pii: true,
      jailbreak: true,
      profanity: true
    });
  });

  it('should validate a single prompt', async () => {
    const result = await guard.validate('Test prompt');
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('input');
    expect(result).toHaveProperty('results');
  });

  it('should validate multiple prompts', async () => {
    const prompts = ['First prompt', 'Second prompt'];
    const result = await guard.validateBatch(prompts);
    expect(result).toHaveProperty('responses');
    expect(result.responses).toHaveLength(2);
  });
}); 