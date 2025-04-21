import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MovementWeightCalculator } from './MovementWeightCalculator.js';
import { WeightCalculatorBase } from './WeightCalculatorBase.js';
import { ChanceRatioMapType } from '../shared/types/chance-ratio-map-type.js';
import type { Movement } from '../movement/Movement.js';
import { MovementCharacter } from '../enums/movement-enums.js';

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
  [MovementCharacter.UNKNOWN, 3],
  [MovementCharacter.TURN, 1],
  ['difficult', 2],
  [MovementCharacter.STEP, 1],
]);

const mockChanceRatioMap: ChanceRatioMapType = new Map<string, number>([
  ['step', 8],
  ['turn', 9],
  ['sequence', 9],
  ['hop', 8],
  ['glide', 8],
  ['unknown', 8],
  ['difficult', 50],
]);

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

  describe('public methods', () => {
    describe('count', () => {
      describe('должен вызывать методы', () => {
        let calcAny: any;
        beforeEach(() => {
          calcAny = calc as unknown as any;
        });

        const methodNameList = [
          'groupAndCountMovements',
          'recalculateChanceRatio',
          'calcWeight',
        ];

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
          [MovementCharacter.UNKNOWN, 3],
          [MovementCharacter.TURN, 1],
          ['difficult', 2],
          [MovementCharacter.STEP, 1],
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
        const expected = new Map<string, number>([
          [MovementCharacter.UNKNOWN, 8],
          [MovementCharacter.TURN, 9],
          ['difficult', 50],
          [MovementCharacter.STEP, 8],
        ]);
        const result = calc['getActualChanceRatioMap'](
          Array.from(mockGroupMovementCounted.keys()),
          mockChanceRatioMap
        );
        expect(result).toStrictEqual(expected);
      });
    });

    describe('separatePercentByType', () => {
      it('должен вернуть количество используемых и неиспользуемых процентов', () => {
        const mockMap = new Map<string, number>([
          [MovementCharacter.UNKNOWN, 8],
          [MovementCharacter.TURN, 9],
          ['difficult', 50],
          [MovementCharacter.STEP, 8],
        ]);
        const expected = { unusedPercent: 25, usedPercent: 25 };
        const result = calc['separatePercentByType'](mockMap);
        expect(result).toStrictEqual(expected);
      });
    });

    describe('redistributeChanceRatio', () => {
      it('должен вернуть Map с обновленными значениями процентов ', () => {
        const mockPercentageSeparate = { unusedPercent: 25, usedPercent: 25 };
        const mockMap = new Map<string, number>([
          [MovementCharacter.UNKNOWN, 8],
          [MovementCharacter.TURN, 9],
          ['difficult', 50],
          [MovementCharacter.STEP, 8],
        ]);
        const expected = new Map<string, number>([
          [MovementCharacter.UNKNOWN, 16],
          [MovementCharacter.TURN, 18],
          ['difficult', 50],
          [MovementCharacter.STEP, 16],
        ]);
        const result = calc['redistributeChanceRatio'](
          mockPercentageSeparate,
          mockMap
        );
        expect(result).toStrictEqual(expected);
      });
    });

    describe('calcWeight', () => {
      it('должен вернуть', () => {
        const mockGroupMovementCounted = new Map([
          [MovementCharacter.UNKNOWN, 3], // 1.17
          [MovementCharacter.TURN, 1], // 1.26
          ['difficult', 2], // 3.5
          [MovementCharacter.STEP, 1], // 1.12
        ]);
        const mockRecalculatedMap = new Map<string, number>([
          [MovementCharacter.UNKNOWN, 16],
          [MovementCharacter.TURN, 18],
          ['difficult', 50],
          [MovementCharacter.STEP, 16],
        ]);

        const expected = new Map<string, number>([
          [MovementCharacter.UNKNOWN, 0.37],
          [MovementCharacter.TURN, 1.26],
          ['difficult', 1.75],
          [MovementCharacter.STEP, 1.12],
        ]);
        const result = calc['calcWeight'](
          mockGroupMovementCounted,
          mockRecalculatedMap
        );

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
