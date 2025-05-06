import { describe, expect, it } from 'vitest';
import { createCoordinates } from './utils';

describe('Utils of SequenceTracker', () => {
  describe('createCoordinates', () => {
    it('должен выбрасывать ошибку', () => {
      expect(() => createCoordinates(100, 100)).toThrowError(
        `X coordinate must be between 1 and 39. Got: 100`,
      );
    });
  });
});
