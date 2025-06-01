import { beforeEach, describe, expect, it } from 'vitest';
import { VectorKey } from '../../../../shared/enums/vector-key.enum';
import { VectorKeyWeightMapType } from '../../../../shared/types/roulette/chance-ratio-map.type';
import { WeightCalculator } from '../WeightCalculator';
import { vectorKeyKeyExtractor } from '../extractors';

const mockChanceRatioMap: VectorKeyWeightMapType = new Map<VectorKey, number>([
  [VectorKey.NORTH, 12],
  [VectorKey.NORTH_EAST, 12],
  [VectorKey.EAST, 22],
  [VectorKey.SOUTH_EAST, 32],
  [VectorKey.SOUTH, 22],
]);

const mockSelection = [
  VectorKey.NORTH,
  VectorKey.NORTH_EAST,
  VectorKey.EAST,
  VectorKey.SOUTH_EAST,
  VectorKey.SOUTH,
];

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

  describe('calcWeights', () => {
    it('должен вернуть Map с корректными весами', () => {
      const mockGroupItemCounted = new Map<VectorKey, number>([
        [VectorKey.NORTH, 1],
        [VectorKey.NORTH_EAST, 1],
        [VectorKey.EAST, 1],
        [VectorKey.SOUTH_EAST, 1],
        [VectorKey.SOUTH, 1],
      ]);
      const expected = new Map<VectorKey, number>([
        [VectorKey.NORTH, 0.6],
        [VectorKey.NORTH_EAST, 0.6],
        [VectorKey.EAST, 1.1],
        [VectorKey.SOUTH_EAST, 1.6],
        [VectorKey.SOUTH, 1.1],
      ]);
      const result = weightCalcAny.calcWeights(mockGroupItemCounted, mockChanceRatioMap);
      expect(result).toStrictEqual(expected);
    });
  });

  describe('groupAndCountItems', () => {
    it('should ', () => {
      const mockSelection = [
        VectorKey.NORTH,
        VectorKey.NORTH_EAST,
        VectorKey.EAST,
        VectorKey.SOUTH_EAST,
        VectorKey.SOUTH,
      ];
      weightCalcAny.groupAndCountItems(mockSelection, vectorKeyKeyExtractor);
    });
  });
});
