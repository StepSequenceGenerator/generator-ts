import { beforeEach, describe, expect, it } from 'vitest';
import { Movement } from './Movement.js';
import { MovementCharacter } from '../../shared/enums/movement-enums.js';
import { TurnAbsoluteName } from '../../shared/enums/turn-absolute-name-enum.js';

describe('Movement', () => {
  const movementData = {
    id: 'testId',
    name: 'тест',
    transitionDirection: 2,
    rotationDirection: 1,
    rotationDegree: 0,
    startLeg: 1,
    endLeg: 0,
    isChangeLeg: true,
    startEdge: 0,
    endEdge: 1,
    isChangeEdge: true,
    isSpeedIncrease: true,
    isDifficult: true,
    type: MovementCharacter.UNKNOWN,
    description: '',
    absoluteName: TurnAbsoluteName.UNKNOWN,
  };

  let movement: Movement;

  beforeEach(() => {
    movement = new Movement(movementData);
  });

  describe('implementation', () => {
    it('должен корректно создаваться', () => {
      expect(movement).toBeDefined();
      expect(movement).toBeInstanceOf(Movement);
    });
  });
});
