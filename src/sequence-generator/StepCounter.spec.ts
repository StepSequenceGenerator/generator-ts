import { beforeEach, describe, it, expect, vi } from 'vitest';
import { StepCounter } from './StepCounter.js';
import { getFuncResult } from '../utils/test-utils/get-func-result.js';
import { Movement } from '../movement/Movement.js';
import { TurnAbsoluteName } from '../enums/turn-absolute-name-enum.js';

describe('StepCounter', () => {
  let counter: StepCounter;

  beforeEach(() => {
    counter = new StepCounter();
  });

  describe('implementation', () => {
    it('должен корректно создаваться', () => {
      expect(counter).toBeDefined();
      expect(counter).toBeInstanceOf(StepCounter);
    });
  });

  describe('increaseDifficultAll', () => {
    it('должен увеличить на единицу turns.difficultAll', () => {
      counter['turns'].difficultAll = 1;
      counter['increaseTurnsDifficultAll']();

      const expected = 2;
      const result = counter.difficultTurnsAllAmount;

      expect(result).toEqual(expected);
    });
  });

  describe('increaseDifficultOrigin', () => {
    it('должен увеличить на единицу одно свойство в turns.difficultOrigin', () => {
      const turnAbsoluteName = TurnAbsoluteName.ROCKER;
      const currentDifficultOriginAmount = 1;
      counter['increaseDifficultOrigin'](
        turnAbsoluteName,
        currentDifficultOriginAmount
      );

      const expected = 2;
      const result = counter['turns'].difficultOrigin.get(turnAbsoluteName);

      expect(result).toEqual(expected);
    });
  });

  describe('getCurrentDifficultOriginAmount', () => {
    it('должен вернуть значение свойства в counter.turns', () => {
      const turnAbsoluteName = TurnAbsoluteName.ROCKER;
      counter['turns'].difficultOrigin.set(turnAbsoluteName, 1);

      const result =
        counter['getCurrentDifficultOriginAmount'](turnAbsoluteName);
      const expected = 1;

      expect(result).toEqual(expected);
    });
  });
});
