import { describe, expect, it } from 'vitest';
import { randomGenerator } from '../random-generator';

describe('randomGenerator', () => {
  it('должен выбросить ошибку, если max <= min', () => {
    const min = 3;
    const max = 2;
    expect(() => {
      randomGenerator(min, max);
    }).toThrowError(
      `from randomGenerator: Not enough maximum number. Should be > ${min}, got ${max}`,
    );
  });
});
