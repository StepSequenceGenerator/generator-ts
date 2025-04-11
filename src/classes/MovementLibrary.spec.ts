import { beforeEach, describe, expect, it } from 'vitest';
import { getFuncResult } from '../utils/test-utils/get-func-result.js';
import { Movement } from './Movement.js';
import { MovementLibrary } from './MovementLibrary.js';
import { Leg } from '../enums/movement-enums.js';

describe('MovementLibrary', () => {
  const mockMovements: Movement[] = [
    { name: 'A', startLeg: Leg.LEFT } as Movement,
    { name: 'B', startLeg: Leg.RIGHT } as Movement,
  ];
  let movementLibrary: MovementLibrary;

  beforeEach(() => {
    movementLibrary = new MovementLibrary(mockMovements);
  });

  describe('implementation', () => {
    it('должен корректно создаваться', () => {
      expect(movementLibrary).toBeDefined();
      expect(movementLibrary).toBeInstanceOf(MovementLibrary);
    });
  });

  describe('filterBy', () => {
    it('должен вернуть true', () => {
      const input = (m: Movement) => m.startLeg === Leg.LEFT;
      const expected = [{ name: 'A', startLeg: Leg.LEFT }];
      const result = getFuncResult<MovementLibrary>(
        movementLibrary,
        'filterBy',
        input
      );
      expect(result.movements).toEqual(expected);
    });
  });
});
