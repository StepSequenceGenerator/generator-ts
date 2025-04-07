import { beforeEach, describe, expect, it } from 'vitest';
import { Movement } from './Movement.js';
import { MovementLibrary } from './MovementLibrary.js';

describe('MovementLibrary', () => {
  const mockMovements: Movement[] = [];
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
});
