import { describe, expect, it } from 'vitest';
import { Movement } from './Movement.js';

describe('Movement', () => {
  const movementData = {
    name: 'тест',
    translationDirection: 2,
    rotationDirection: 1,
    rotationDegree: 0,
    startLeg: [0, 1],
    isChangeLeg: true,
    startEdge: 0,
    isChangeEdge: true,
    isSpeedIncrease: true,
  };

  describe('implementation', () => {
    it('должен корректно создаваться', () => {
      const movement = new Movement(movementData);
      expect(movement).toBeDefined();
      expect(movement).toBeInstanceOf(Movement);
    });
  });
});
