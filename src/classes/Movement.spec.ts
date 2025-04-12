import { beforeEach, describe, expect, it } from 'vitest';
import { Movement } from './Movement.js';

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
