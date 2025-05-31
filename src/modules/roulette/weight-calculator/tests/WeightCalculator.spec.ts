import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WeightCalculator } from '../WeightCalculator';

describe('WeightCalculator', () => {
  let weightCalc: WeightCalculator;
  // eslint-disable-next-line
  let weightCalcAny: any;

  beforeEach(() => {
    weightCalc = new WeightCalculator();
    // eslint-disable-next-line
    weightCalcAny = weightCalc as unknown as any;
  });

  describe('implementation', () => {
    it('должен корректно создаваться', () => {
      expect(weightCalc).toBeDefined();
    });
  });

  describe('calcItemWeight', () => {
    const methodList = ['calcDesireItemAmount', 'calcWeight'];
    it.each(methodList)('должен вызвать метод %s', (method) => {
      const spyMethod = vi.spyOn(weightCalcAny, method);
      weightCalcAny.calcItemWeight({
        currentItemAmount: 12,
        desirePercent: 75,
        totalItems: 12,
      });
      expect(spyMethod).toHaveBeenCalled();
    });
  });

  describe('calcDesireItemAmount', () => {
    it('должен вернуть количество элементов на основе желаемого процента от общего числа', () => {
      const mockTotalItems = 12;
      const mockDesirePercent = 75;
      const expected = 9;
      const result = weightCalcAny.calcDesireItemAmount(mockTotalItems, mockDesirePercent);
      expect(result).toEqual(expected);
    });
  });

  describe('calcWeight', () => {
    it('должен вернуть вес одного элемента (частное)', () => {
      const mockCurrentItemAmount = 12;
      const mockDesireItemAmount = 9;
      const expected = 0.75;
      const result = weightCalcAny.calcWeight(mockCurrentItemAmount, mockDesireItemAmount);
      expect(result).toEqual(expected);
    });
  });
});
