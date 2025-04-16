import { beforeEach, describe, expect, it } from 'vitest';
import { StepCounter } from './StepCounter.js';
import { TurnAbsoluteName } from '../enums/turn-absolute-name-enum.js';
import { Movement } from '../movement/Movement.js';
import {
  RotationDegree,
  RotationDirection,
  RotationDirectionString,
} from '../enums/movement-enums.js';

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

  //  note turns
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

  describe('conditionIsTurnDifficult', () => {
    it('должен вернуть true', () => {
      const mockMovement = { isDifficult: true } as Movement;
      const result = counter['conditionIsTurnDifficult'](mockMovement);
      expect(result).toBeTruthy();
    });

    it('должен вернуть false', () => {
      const mockMovement = { isDifficult: false } as Movement;
      const result = counter['conditionIsTurnDifficult'](mockMovement);
      expect(result).toBeFalsy();
    });
  });

  describe('conditionToIncreaseDifficultOrigin', () => {
    it('должен вернуть true', () => {
      const turnAbsoluteName = TurnAbsoluteName.ROCKER;
      counter['turns'].difficultOrigin.set(turnAbsoluteName, 1);
      const result =
        counter['conditionToIncreaseDifficultOrigin'](turnAbsoluteName);
      expect(result).toBeTruthy();
    });

    it('должен вернуть false', () => {
      const turnAbsoluteName = TurnAbsoluteName.ROCKER;
      counter['turns'].difficultOrigin.set(turnAbsoluteName, 2);
      const result =
        counter['conditionToIncreaseDifficultOrigin'](turnAbsoluteName);
      expect(result).toBeFalsy();
    });
  });

  // note rotations

  describe('increaseRotations', () => {
    it('должен увеличить counter.rotations на 180', () => {
      const mockCurrentMovement = {
        rotationDegree: RotationDegree.DEGREE_180,
        rotationDirection: RotationDirection.CLOCKWISE,
      } as Movement;

      counter['increaseRotations'](mockCurrentMovement, 180);
      const expected = 360;
      const result = counter['rotations'].get(
        RotationDirectionString.CLOCKWISE
      );
      expect(result).toEqual(expected);
    });
  });

  describe('conditionToIncreaseRotations', () => {
    it('должен вернуть true (проверка первого условия)', () => {
      const mockCurrentMovement = {
        rotationDegree: RotationDegree.DEGREE_360,
        rotationDirection: RotationDirection.COUNTERCLOCKWISE,
      } as Movement;
      const mockLastStep = {
        rotationDirection: RotationDirection.CLOCKWISE,
      } as Movement;

      counter['lastStep'] = mockLastStep;

      const result =
        counter['conditionToIncreaseRotations'](mockCurrentMovement);
      expect(result).toBeTruthy();
    });

    it('должен вернуть true (проверка второго условия)', () => {
      const mockCurrentMovement = {
        rotationDegree: RotationDegree.DEGREE_180,
        rotationDirection: RotationDirection.CLOCKWISE,
      } as Movement;
      const mockLastStep = {
        rotationDirection: RotationDirection.CLOCKWISE,
      } as Movement;

      counter['lastStep'] = mockLastStep;

      const result =
        counter['conditionToIncreaseRotations'](mockCurrentMovement);
      expect(result).toBeTruthy();
    });

    it('должен вернуть false (проверка первого условия)', () => {
      const mockCurrentMovement = {
        rotationDegree: RotationDegree.DEGREES_0,
        rotationDirection: RotationDirection.CLOCKWISE,
      } as Movement;
      const mockLastStep = {
        rotationDirection: RotationDirection.CLOCKWISE,
      } as Movement;

      counter['lastStep'] = mockLastStep;

      const result =
        counter['conditionToIncreaseRotations'](mockCurrentMovement);
      expect(result).toBeFalsy();
    });

    it('должен вернуть false (проверка второго условия)', () => {
      const mockCurrentMovement = {
        rotationDegree: RotationDegree.DEGREE_180,
        rotationDirection: RotationDirection.CLOCKWISE,
      } as Movement;
      const mockLastStep = {
        rotationDirection: RotationDirection.COUNTERCLOCKWISE,
      } as Movement;

      counter['lastStep'] = mockLastStep;

      const result =
        counter['conditionToIncreaseRotations'](mockCurrentMovement);
      expect(result).toBeFalsy();
    });
  });
});
