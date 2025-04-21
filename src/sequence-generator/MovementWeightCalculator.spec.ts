import { beforeEach, describe, expect, it } from 'vitest';
import { MovementWeightCalculator } from './MovementWeightCalculator.js';
import { WeightCalculatorBase } from './WeightCalculatorBase.js';

describe('MovementWeightCalculator', () => {
  let calc: MovementWeightCalculator;
  beforeEach(() => {
    calc = new MovementWeightCalculator();
  });

  describe('implementation', () => {
    it('должен корректно создаваться', () => {
      expect(calc).toBeDefined();
      expect(calc).toBeInstanceOf(WeightCalculatorBase);
    });
  });
});
