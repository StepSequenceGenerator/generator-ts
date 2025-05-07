import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SequenceTracker } from './SequenceTracker';
import { START_COORDINATES } from './start-coordinates';
import { VECTOR_ANGLES } from './vector-angles';
import { TRACK_VECTORS } from './track-vectors';
import { createCoordinates } from './utils';
import { VectorKey } from './enums';

describe('SequenceTracker', () => {
  let sequenceTracker: SequenceTracker;

  beforeEach(() => {
    sequenceTracker = new SequenceTracker(START_COORDINATES, TRACK_VECTORS, VECTOR_ANGLES);
  });

  describe('implementation', () => {
    it('должен корректно создаваться', () => {
      expect(sequenceTracker).toBeDefined();
    });
  });

  describe('getStartCoordinates', () => {
    it('должен вернуть стартовые координаты', () => {
      const sequenceTrackerAny = sequenceTracker as unknown as any;
      vi.spyOn(sequenceTrackerAny, 'getRandom').mockReturnValue(0);

      const expected = createCoordinates(5, 5);
      const result = sequenceTracker.getStartCoordinates();
      expect(result).toBeDefined();
      expect(result).toStrictEqual(expected);
    });
  });

  describe('getAllowedVectorKeys', () => {
    it('должен вернуть массив ключей', () => {
      const input = VectorKey.NORTH;
      const expected = ['north', 'west', 'east', 'north_west', 'north_east'];
      const result = sequenceTracker['getAllowedVectorKeys'](input);
      expect(result).toStrictEqual(expected);
    });
  });
});
