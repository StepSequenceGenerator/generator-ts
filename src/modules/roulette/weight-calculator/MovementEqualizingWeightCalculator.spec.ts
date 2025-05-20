import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MovementEqualizingWeightCalculator } from './MovementEqualizingWeightCalculator';
import { ExtendedMovementCharacter, MovementCharacter } from '../../../shared/enums/movement-enums';
import type { Movement } from '../../movement/Movement';

describe('MovementEqualWeightCalculator', () => {
  // unknown = 3, turn = 1, step = 1, difficult = 1, glide = 1, hop = 1, sequence = 2
  const mockMovements: Movement[] = [
    { type: MovementCharacter.UNKNOWN, isDifficult: false } as Movement,
    { type: MovementCharacter.UNKNOWN, isDifficult: false } as Movement,
    { type: MovementCharacter.UNKNOWN, isDifficult: false } as Movement,
    { type: MovementCharacter.TURN, isDifficult: false } as Movement,
    { type: MovementCharacter.TURN, isDifficult: true } as Movement,
    { type: MovementCharacter.STEP, isDifficult: true } as Movement,
    { type: MovementCharacter.STEP, isDifficult: false } as Movement,
    { type: MovementCharacter.GLIDE, isDifficult: false } as Movement,
    { type: MovementCharacter.HOP, isDifficult: false } as Movement,
    { type: MovementCharacter.SEQUENCE, isDifficult: false } as Movement,
    { type: MovementCharacter.SEQUENCE, isDifficult: false } as Movement,
  ];

  const mockCharacterCounted = new Map([
    [ExtendedMovementCharacter.UNKNOWN, 3],
    [ExtendedMovementCharacter.DIFFICULT, 2],
    [ExtendedMovementCharacter.SEQUENCE, 2],
    [ExtendedMovementCharacter.TURN, 1],
    [ExtendedMovementCharacter.STEP, 1],
    [ExtendedMovementCharacter.GLIDE, 1],
    [ExtendedMovementCharacter.HOP, 1],
  ]);

  const equalWeightMap = new Map([
    ['unknown', 1],
    ['difficult', Math.round((3 / 2) * 100) / 100],
    ['sequence', Math.round((3 / 2) * 100) / 100],
    ['turn', Math.round((3 / 1) * 100) / 100],
    ['step', Math.round((3 / 1) * 100) / 100],
    ['glide', Math.round((3 / 1) * 100) / 100],
    ['hop', Math.round((3 / 1) * 100) / 100],
  ]);

  let calculator: MovementEqualizingWeightCalculator;

  beforeEach(() => {
    calculator = new MovementEqualizingWeightCalculator();
  });

  describe('implementation', () => {
    it('implementation', () => {
      expect(calculator).toBeDefined();
      expect(calculator).toBeInstanceOf(MovementEqualizingWeightCalculator);
    });
  });

  describe('count', () => {
    const funcNameList = ['groupAndCountMovements', 'getMaxGroupSize', 'calcWeight'];

    it.each([funcNameList])('должен вызвать %s', (name) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const calculatorAny = calculator as unknown as any;
      const spyFn = vi.spyOn(calculatorAny, name);
      calculator.count(mockMovements);
      expect(spyFn).toBeCalled();
    });

    it('должен вернуть данные определенного типа', () => {
      const result = calculator.count(mockMovements);
      expect(result).toBeInstanceOf(Map);
    });
  });

  describe('countEachCharacterAmount', () => {
    it('должен корректно посчитать количество элементов каждого типа', () => {
      const expected = mockCharacterCounted;
      const result = calculator['groupAndCountMovements'](mockMovements);
      expect(result).toStrictEqual(expected);
    });
  });

  describe('getMaxGroupSize', () => {
    it('должен отдать максимальное количество', () => {
      const input = mockCharacterCounted;
      const expected = 3;
      const result = calculator['getMaxGroupSize'](input);
      expect(result).toEqual(expected);
    });
  });

  describe('calcEqualizingWeights', () => {
    it('должен вернуть Map с подсчитанными весами', () => {
      const expected = equalWeightMap;
      const result = calculator['calcWeight'](3, mockCharacterCounted);
      expect(result).toStrictEqual(expected);
    });
  });
});
