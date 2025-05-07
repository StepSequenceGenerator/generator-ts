import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SequenceTracker } from './SequenceTracker';
import { START_COORDINATES } from './start-coordinates';
import { VECTOR_ANGLES } from './vector-angles';
import { TRACK_VECTORS } from './track-vectors';
import { createCoordinates } from './utils';
import { VectorKey } from './enums';
import { XCoordinateType, XCursorType } from './types';

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  describe('getNextMovementVector', () => {
    it('должен вернуть Vector', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sequenceTrackerAny = sequenceTracker as unknown as any;
      vi.spyOn(sequenceTrackerAny, 'getRandom').mockReturnValue(1);

      const input = [VectorKey.NORTH, VectorKey.EAST, VectorKey.WEST];
      const expected = VectorKey.EAST;

      const result = sequenceTrackerAny['getNextMovementVector'](input);
      expect(result).toStrictEqual(expected);
    });

    it('должен выбросить ошибку при vectors.length = 0', () => {
      expect(() => sequenceTracker['getNextMovementVector']([])).toThrowError(
        'vectors.length should be more than 0',
      );
    });
  });

  describe('calcCoordinate', () => {
    it('должен вернуть определенный результат калькуляции', () => {
      const mockCursor = -1 as XCursorType;
      const mockCoord = 37 as XCoordinateType;
      const mockDistance = 2;

      const expected = 35;
      const result = sequenceTracker['calcCoordinate']({
        cursor: mockCursor,
        coord: mockCoord,
        distance: mockDistance,
      });
      expect(result).toEqual(expected);
    });
  });
});
