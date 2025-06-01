import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MovementChanceRatioMapGenerator } from './MovementChanceRatioMapGenerator';
import { MovementChanceRatioMapType } from '../../shared/types/roulette/chance-ratio-map.type';
import { ExtendedMovementCharacter } from '../../shared/enums/movement-enums';

const mockChanceRatioMap: MovementChanceRatioMapType = new Map<ExtendedMovementCharacter, number>([
  [ExtendedMovementCharacter.STEP, 8],
  [ExtendedMovementCharacter.TURN, 9],
  [ExtendedMovementCharacter.SEQUENCE, 9],
  [ExtendedMovementCharacter.HOP, 8],
  [ExtendedMovementCharacter.GLIDE, 8],
  [ExtendedMovementCharacter.UNKNOWN, 8],
  [ExtendedMovementCharacter.DIFFICULT, 50],
]);

const mockGroupMovementCounted = new Map([
  [ExtendedMovementCharacter.UNKNOWN, 3],
  [ExtendedMovementCharacter.TURN, 1],
  [ExtendedMovementCharacter.DIFFICULT, 2],
  [ExtendedMovementCharacter.STEP, 1],
]);

describe('MovementChanceRatioMapGenerator', () => {
  let chanceRatioMapGenerator: MovementChanceRatioMapGenerator;
  // eslint-disable-next-line
  let chanceRatioMapGeneratorAny: any;

  beforeEach(() => {
    chanceRatioMapGenerator = new MovementChanceRatioMapGenerator();
    // eslint-disable-next-line
    chanceRatioMapGeneratorAny = chanceRatioMapGenerator as unknown as any;
  });

  describe('implementation', () => {
    it('должен корректно создаваться', () => {
      expect(chanceRatioMapGenerator).toBeDefined();
    });
  });

  describe('recalculateChanceRatio', () => {
    describe('должен вызывать методы', () => {
      const methodNameList = [
        'getActualChanceRatioMap',
        'separatePercentByType',
        'redistributeChanceRatio',
      ];

      it.each(methodNameList)('метод %s', (methodName) => {
        const spyFn = vi.spyOn(chanceRatioMapGeneratorAny, methodName);
        chanceRatioMapGenerator['calcChanceRatio']([], mockChanceRatioMap);
        expect(spyFn).toHaveBeenCalled();
      });
    });
  });

  describe('getActualChanceRatioMap', () => {
    it('должен вернуть Map с актуальными ключами и значениями процентов', () => {
      const expected = new Map<ExtendedMovementCharacter, number>([
        [ExtendedMovementCharacter.UNKNOWN, 8],
        [ExtendedMovementCharacter.TURN, 9],
        [ExtendedMovementCharacter.DIFFICULT, 50],
        [ExtendedMovementCharacter.STEP, 8],
      ]);
      const result = chanceRatioMapGenerator['getActualChanceRatioMap'](
        Array.from(mockGroupMovementCounted.keys()),
        mockChanceRatioMap,
      );
      expect(result).toStrictEqual(expected);
    });
  });

  describe('separatePercentByType', () => {
    it('должен вернуть количество используемых и неиспользуемых процентов', () => {
      const mockMap = new Map<ExtendedMovementCharacter, number>([
        [ExtendedMovementCharacter.UNKNOWN, 8],
        [ExtendedMovementCharacter.TURN, 9],
        [ExtendedMovementCharacter.DIFFICULT, 50],
        [ExtendedMovementCharacter.STEP, 8],
      ]);
      const expected = { unusedPercent: 25, usedPercent: 25 };
      const result = chanceRatioMapGenerator['separatePercentByType'](mockMap);
      expect(result).toStrictEqual(expected);
    });
  });

  describe('redistributeChanceRatio', () => {
    it('должен вернуть Map с обновленными значениями процентов ', () => {
      const mockPercentageSeparate = { unusedPercent: 25, usedPercent: 25 };
      const mockMap = new Map<ExtendedMovementCharacter, number>([
        [ExtendedMovementCharacter.UNKNOWN, 8],
        [ExtendedMovementCharacter.TURN, 9],
        [ExtendedMovementCharacter.DIFFICULT, 50],
        [ExtendedMovementCharacter.STEP, 8],
      ]);
      const expected = new Map<ExtendedMovementCharacter, number>([
        [ExtendedMovementCharacter.UNKNOWN, 16],
        [ExtendedMovementCharacter.TURN, 18],
        [ExtendedMovementCharacter.DIFFICULT, 50],
        [ExtendedMovementCharacter.STEP, 16],
      ]);
      const result = chanceRatioMapGenerator['redistributeChanceRatio'](
        mockPercentageSeparate,
        mockMap,
      );
      expect(result).toStrictEqual(expected);
    });
  });
});
