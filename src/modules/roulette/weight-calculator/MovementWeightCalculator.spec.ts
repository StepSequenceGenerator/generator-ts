import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MovementDefaultWeightCalculator } from './MovementDefaultWeightCalculator';
import { MovementWeightCalculatorBase } from './MovementWeightCalculatorBase';
import { MovementChanceRatioMapType } from '../../../shared/types/movement-chance-ratio-map.type';
import type { Movement } from '../../movement/Movement';
import { ExtendedMovementCharacter, MovementCharacter } from '../../../shared/enums/movement-enums';

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
  let calc: MovementDefaultWeightCalculator;
  beforeEach(() => {
    calc = new MovementDefaultWeightCalculator();
  });

  describe('implementation', () => {
    it('должен корректно создаваться', () => {
      expect(calc).toBeDefined();
      expect(calc).toBeInstanceOf(MovementWeightCalculatorBase);
    });
  });

  describe('public methods', () => {
    describe('count', () => {
      describe('должен вызывать методы', () => {
        let calcAny: any;
        beforeEach(() => {
          calcAny = calc as unknown as any;
        });

        const methodNameList = ['groupAndCountMovements', 'recalculateChanceRatio', 'calcWeight'];

        it.each(methodNameList)('метод %s', (methodName) => {
          const spyFn = vi.spyOn(calcAny, methodName);
          calc.count(mockMovements, mockChanceRatioMap);
          expect(spyFn).toHaveBeenCalled();
        });
      });
    });
  });

  describe('private methods', () => {
    describe('groupAndCountMovements', () => {
      it('должен вернуть корректно подсчитанное количество типов движений', () => {
        const expected = new Map([
          [ExtendedMovementCharacter.UNKNOWN, 3],
          [ExtendedMovementCharacter.TURN, 1],
          [ExtendedMovementCharacter.DIFFICULT, 2],
          [ExtendedMovementCharacter.STEP, 1],
        ]);
        const result = calc['groupAndCountMovements'](mockMovements);
        expect(result).toStrictEqual(expected);
      });
    });

    describe('recalculateChanceRatio', () => {
      describe('должен вызывать методы', () => {
        let calcAny: any;
        beforeEach(() => {
          calcAny = calc as unknown as any;
        });

        const methodNameList = [
          'getActualChanceRatioMap',
          'separatePercentByType',
          'redistributeChanceRatio',
        ];

        it.each(methodNameList)('метод %s', (methodName) => {
          const spyFn = vi.spyOn(calcAny, methodName);
          calc['recalculateChanceRatio']([], mockChanceRatioMap);
          expect(spyFn).toHaveBeenCalled();
        });
      });
      //   todo
    });

    describe('getActualChanceRatioMap', () => {
      it('должен вернуть Map с актуальными ключами и значениями процентов', () => {
        const expected = new Map<ExtendedMovementCharacter, number>([
          [ExtendedMovementCharacter.UNKNOWN, 8],
          [ExtendedMovementCharacter.TURN, 9],
          [ExtendedMovementCharacter.DIFFICULT, 50],
          [ExtendedMovementCharacter.STEP, 8],
        ]);
        const result = calc['getActualChanceRatioMap'](
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
        const result = calc['separatePercentByType'](mockMap);
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
        const result = calc['redistributeChanceRatio'](mockPercentageSeparate, mockMap);
        expect(result).toStrictEqual(expected);
      });
    });

    describe('calcWeight', () => {
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
        const result = calc['calcWeight'](mockGroupMovementCounted, mockRecalculatedMap);

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
