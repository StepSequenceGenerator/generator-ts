import { beforeEach, describe, expect, it } from 'vitest';
import { VectorKey } from '../../shared/enums/vector-key.enum';
import { VectorKeyChanceRatioMapGenerator } from './VectorKeyChanceRatioMapGenerator';
// todo доделать
describe('VectorKeyChanceRatioMapGenerator', () => {
  let chanceRatioMapGenerator: VectorKeyChanceRatioMapGenerator;
  beforeEach(() => {
    chanceRatioMapGenerator = new VectorKeyChanceRatioMapGenerator();
  });
  describe('initialize', () => {
    it('должен корректно создаваться', () => {
      expect(chanceRatioMapGenerator).toBeDefined();
    });
  });

  describe('getVectorKeysWithNormalizeAngles', () => {
    it('должен вернуть массив [-90, -45, 0, 45, 90]', () => {
      // north_east [ 'north', 'north_east', 'east', 'south_east', 'north_west' ]
      const mockCurrentVectorKey = VectorKey.NORTH_EAST;
      const mockVectorKeys = [
        'north',
        'north_east',
        'east',
        'south_east',
        'north_west',
      ] as VectorKey[];
      const expected = new Map<VectorKey, number>([
        [VectorKey.NORTH, -45],
        [VectorKey.NORTH_EAST, 0],
        [VectorKey.EAST, 45],
        [VectorKey.SOUTH_EAST, 90],
        [VectorKey.NORTH_WEST, -90],
      ]);
      const result = chanceRatioMapGenerator['getVectorKeysWithNormalizeAngles'](
        mockCurrentVectorKey,
        mockVectorKeys,
      );
      expect(result).toStrictEqual(expected);
    });
  });
});
