import { beforeEach, describe, expect, it } from 'vitest';
import { Movement } from './Movement.js';
import {
  Edge,
  Leg,
  MovementCharacter,
  TransitionDirection,
} from '../../shared/enums/movement-enums.js';
import { TurnAbsoluteName } from '../../shared/enums/turn-absolute-name-enum.js';

describe('Movement', () => {
  const movementData = {
    id: 'testId',
    name: 'тест',
    transitionDirection: TransitionDirection.FORWARD,
    rotationDirection: 1,
    rotationDegree: 0,
    startLeg: Leg.LEFT,
    endLeg: Leg.LEFT,
    isChangeLeg: true,
    startEdge: Edge.OUTER,
    endEdge: Edge.OUTER,
    isChangeEdge: true,
    isSpeedIncrease: true,
    isDifficult: true,
    type: MovementCharacter.UNKNOWN,
    description: '',
    absoluteName: TurnAbsoluteName.UNKNOWN,
    distance: 2,
  };

  let movement: Movement;

  it('ключи в movementData должны соответствовать ключам в Movement', () => {
    const mockInstance = new Movement({} as Movement);
    const originKeys = Object.keys(mockInstance).sort((a, b) => a.localeCompare(b));
    const movementDataKeys = Object.keys(movementData).sort((a, b) => a.localeCompare(b));
    expect(movementDataKeys).toStrictEqual(originKeys);
  });

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
