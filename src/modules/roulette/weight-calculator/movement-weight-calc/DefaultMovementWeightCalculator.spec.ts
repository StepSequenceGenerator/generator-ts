import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DefaultMovementWeightCalculator } from './DefaultMovementWeightCalculator';
import { MovementChanceRatioMapType } from '../../../../shared/types/chance-ratio-map.type';
import type { Movement } from '../../../movement/Movement';
import {
  ExtendedMovementCharacter,
  MovementCharacter,
} from '../../../../shared/enums/movement-enums';

const mockMovements: Movement[] = [
  { type: MovementCharacter.UNKNOWN, isDifficult: false } as Movement,
  { type: MovementCharacter.UNKNOWN, isDifficult: false } as Movement,
  { type: MovementCharacter.UNKNOWN, isDifficult: false } as Movement,
  { type: MovementCharacter.TURN, isDifficult: false } as Movement,
  { type: MovementCharacter.TURN, isDifficult: true } as Movement,
  { type: MovementCharacter.STEP, isDifficult: true } as Movement,
  { type: MovementCharacter.STEP, isDifficult: false } as Movement,
];

const mockGroupMovementCounted = new Map([
  [ExtendedMovementCharacter.UNKNOWN, 3],
  [ExtendedMovementCharacter.TURN, 1],
  [ExtendedMovementCharacter.DIFFICULT, 2],
  [ExtendedMovementCharacter.STEP, 1],
]);

const mockChanceRatioMap: MovementChanceRatioMapType = new Map<ExtendedMovementCharacter, number>([
  [ExtendedMovementCharacter.STEP, 8],
  [ExtendedMovementCharacter.TURN, 9],
  [ExtendedMovementCharacter.SEQUENCE, 9],
  [ExtendedMovementCharacter.HOP, 8],
  [ExtendedMovementCharacter.GLIDE, 8],
  [ExtendedMovementCharacter.UNKNOWN, 8],
  [ExtendedMovementCharacter.DIFFICULT, 50],
]);

describe('MovementWeightCalculator', () => {
  let calc: DefaultMovementWeightCalculator;
  beforeEach(() => {
    calc = new DefaultMovementWeightCalculator();
  });

  describe('implementation', () => {
    it('должен корректно создаваться', () => {
      expect(calc).toBeDefined();
    });
  });

  describe('public methods', () => {
    describe('count', () => {
      describe('должен вызывать методы', () => {
        // eslint-disable-next-line
        let calcAny: any;
        beforeEach(() => {
          // eslint-disable-next-line
          calcAny = calc as unknown as any;
        });

        const methodNameList = ['groupAndCountItems', 'calcWeight'];

        it.each(methodNameList)('метод %s', (methodName) => {
          const spyFn = vi.spyOn(calcAny, methodName);
          calc.count(mockMovements, mockChanceRatioMap);
          expect(spyFn).toHaveBeenCalled();
        });
      });
    });
  });

  describe('private methods', () => {
    describe('groupAndCountItems', () => {
      it('должен вернуть корректно подсчитанное количество типов движений', () => {
        const expected = new Map([
          [ExtendedMovementCharacter.UNKNOWN, 3],
          [ExtendedMovementCharacter.TURN, 1],
          [ExtendedMovementCharacter.DIFFICULT, 2],
          [ExtendedMovementCharacter.STEP, 1],
        ]);
        const result = calc['groupAndCountItems'](mockMovements);
        expect(result).toStrictEqual(expected);
      });
    });

    describe('calcWeights', () => {
      it('должен вернуть', () => {
        const mockGroupMovementCounted = new Map([
          [ExtendedMovementCharacter.UNKNOWN, 3], // 1.17
          [ExtendedMovementCharacter.TURN, 1], // 1.26
          [ExtendedMovementCharacter.DIFFICULT, 2], // 3.5
          [ExtendedMovementCharacter.STEP, 1], // 1.12
        ]);
        const mockRecalculatedMap = new Map<ExtendedMovementCharacter, number>([
          [ExtendedMovementCharacter.UNKNOWN, 16],
          [ExtendedMovementCharacter.TURN, 18],
          [ExtendedMovementCharacter.DIFFICULT, 50],
          [ExtendedMovementCharacter.STEP, 16],
        ]);

        const expected = new Map<ExtendedMovementCharacter, number>([
          [ExtendedMovementCharacter.UNKNOWN, 0.37],
          [ExtendedMovementCharacter.TURN, 1.26],
          [ExtendedMovementCharacter.DIFFICULT, 1.75],
          [ExtendedMovementCharacter.STEP, 1.12],
        ]);
        const result = calc['calcWeights'](mockGroupMovementCounted, mockRecalculatedMap);

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
