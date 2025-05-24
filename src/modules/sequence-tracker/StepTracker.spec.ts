import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StepTracker } from './StepTracker';
import { START_COORDINATES } from '../../shared/constants/start-coordinates';
import { VECTOR_ANGLES } from '../../shared/constants/vector-angles';
import { VECTORS_TRACK } from '../../shared/constants/vectors-track';
import { createCoordinates } from './utils';
import { VectorKey } from '../../shared/enums/vector-key.enum';
import { VectorCursorType, XCursorType } from '../../shared/types/vector.type';
import {
  DescartesCoordinatesType,
  XCoordinateType,
} from '../../shared/types/descartes-coordinates.type';

describe('SequenceTracker', () => {
  let sequenceTracker: StepTracker;

  beforeEach(() => {
    sequenceTracker = new StepTracker(START_COORDINATES, VECTORS_TRACK, VECTOR_ANGLES);
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
      const expected = ['north', 'north_east', 'east', 'west', 'north_west'];
      const result = sequenceTracker['getAllowedVectorKeys'](input);
      expect(result).toStrictEqual(expected);
    });

    describe('проверка фильтрации доступных ключей', () => {
      const mockKeysList = Object.values(VectorKey);
      it.each(mockKeysList)('при key = %s должен вернуть 5 ключей', (key) => {
        const result = sequenceTracker['getAllowedVectorKeys'](key);

        console.debug(key, result);
        expect(result.length).toEqual(5);
      });
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

  describe('getNewCoordinates', () => {
    it('должен вернуть координаты', () => {
      const mock_vectorCursor = { x: 1, y: 1 } as VectorCursorType;
      const mock_currentCoordinates = { x: 29, y: 27 } as DescartesCoordinatesType;
      const mock_distance = 2;
      const expected = { x: 31, y: 29 };
      const result = sequenceTracker['getNewCoordinates']({
        vectorCursor: mock_vectorCursor,
        currentCoordinates: mock_currentCoordinates,
        distance: mock_distance,
      });
      expect(result).toEqual(expected);
    });

    // todo разобраться с этим тестом
    const mockCurrentCoordinatesList = [
      { x: 59, y: 28 },
      { x: 29, y: 29 },
    ] as DescartesCoordinatesType[];
    it.each(mockCurrentCoordinatesList)('должен вернуть null при %s', (mock_currentCoordinates) => {
      const mock_vectorCursor = { x: 1, y: 1 } as VectorCursorType;

      const mock_distance = 2;
      const expected = null;
      const result = sequenceTracker['getNewCoordinates']({
        vectorCursor: mock_vectorCursor,
        currentCoordinates: mock_currentCoordinates,
        distance: mock_distance,
      });
      expect(result).toEqual(expected);
    });
  });

  describe('filterVectorKeys', () => {
    it('должен вернуть отфильтрованный массив', () => {
      const key = VectorKey.NORTH;
      const mockTried = new Set<VectorKey>([key]);

      const mockAllowed = ['north_west', 'north_east', 'north'] as VectorKey[];
      const expected = ['north_west', 'north_east'];
      const result = sequenceTracker['filterVectorKeys'](mockTried, mockAllowed);
      expect(result).toStrictEqual(expected);
    });

    describe('getNextPosition', () => {
      it('должен выбросить ошибку, если availableVectorKeys = []', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sequenceTrackerAny = sequenceTracker as unknown as any;
        vi.spyOn(sequenceTrackerAny, 'getAllowedVectorKeys').mockReturnValue([]);
        const mockCurrentVector = VectorKey.NORTH;
        const mockCurrentCoordinates = { x: 1, y: 1 } as DescartesCoordinatesType;
        const distance = 1;
        expect(() =>
          sequenceTracker.getNextPosition(mockCurrentVector, mockCurrentCoordinates, distance),
        ).toThrowError('Unable to find next coordinates within bounds.');
      });
    });
  });

  // todo доделать
  describe('createVectorKeyChanceRatioMap', () => {
    it('должен вернуть массив [-90, -45, 0, 45, 90]', () => {
      // north_east [ 'north', 'north_east', 'east', 'south_east', 'north_west' ]
      const mockCurrentVectorKey = VectorKey.NORTH_EAST;
      const mockVectorKeys = [
        'north',
        'north_east',
        'east',
        'south_east',
        'north_west',
      ] as VectorKey[];
      const result = sequenceTracker['createVectorKeyChanceRatioMap'](
        mockCurrentVectorKey,
        mockVectorKeys,
      );
    });
  });
});
