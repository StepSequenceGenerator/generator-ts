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
import { VectorKeyChanceRatioMapGenerator } from '../chance-ratio-map-generator/VectorKeyChanceRatioMapGenerator';
import { VectorKeyRoulette } from '../roulette/VectorKeyRoulette';
import { WeightCalculator } from '../roulette/weight-calculator/WeightCalculator';

describe('StepTracker', () => {
  let stepTracker: StepTracker;

  beforeEach(() => {
    const vectorKeyChanceRatioMapGenerator = new VectorKeyChanceRatioMapGenerator();
    const vectorKeyWeightCalculator = new WeightCalculator();
    const vectorKeyRouletteGenerator = new VectorKeyRoulette(vectorKeyWeightCalculator);
    stepTracker = new StepTracker({
      standardStartCoordinates: START_COORDINATES,
      vectorsTrack: VECTORS_TRACK,
      vectorAngles: VECTOR_ANGLES,
      vectorKeyChanceRatioMapGenerator,
      vectorKeyRoulette: vectorKeyRouletteGenerator,
    });
  });

  describe('implementation', () => {
    it('должен корректно создаваться', () => {
      expect(stepTracker).toBeDefined();
    });
  });

  describe('getStartCoordinates', () => {
    it('должен вернуть стартовые координаты', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sequenceTrackerAny = stepTracker as unknown as any;
      vi.spyOn(sequenceTrackerAny, 'getRandom').mockReturnValue(0);

      const expected = createCoordinates(5, 5);
      const result = stepTracker.getStartCoordinates();
      expect(result).toBeDefined();
      expect(result).toStrictEqual(expected);
    });
  });

  describe('getAllowedVectorKeys', () => {
    it('должен вернуть массив ключей', () => {
      const input = VectorKey.NORTH;
      const expected = ['north', 'north_east', 'east', 'west', 'north_west'];
      const result = stepTracker['getAllowedVectorKeys'](input);
      expect(result).toStrictEqual(expected);
    });

    describe('проверка фильтрации доступных ключей', () => {
      const mockKeysList = Object.values(VectorKey);
      it.each(mockKeysList)('при key = %s должен вернуть 5 ключей', (key) => {
        const result = stepTracker['getAllowedVectorKeys'](key);

        console.debug(key, result);
        expect(result.length).toEqual(5);
      });
    });
  });

  describe('getNextMovementVector', () => {
    it('должен вернуть Vector количество раз в соответствии с ratioMap', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sequenceTrackerAny = stepTracker as unknown as any;
      vi.spyOn(sequenceTrackerAny, 'getRandom').mockReturnValue(1);

      const mockVectors = [VectorKey.NORTH, VectorKey.EAST, VectorKey.WEST];
      const mockRatioMap = new Map<VectorKey, number>([
        [VectorKey.NORTH, 1],
        [VectorKey.EAST, 98],
        [VectorKey.WEST, 1],
      ]);

      const counter = new Map<VectorKey, number>();
      for (let i = 0; i < 10000; i++) {
        const result = sequenceTrackerAny['getNextMovementVector'](mockVectors, mockRatioMap);
        if (!counter.has(result)) {
          counter.set(result, 0);
        } else {
          const amount = (counter.get(result) || 0) + 1;
          counter.set(result, amount);
        }
      }

      const northAmount = counter.get(VectorKey.NORTH);
      const eastAmount = counter.get(VectorKey.EAST);
      const westAmount = counter.get(VectorKey.WEST);
      expect(northAmount).approximately(90, 150);
      expect(westAmount).approximately(90, 150);
      expect(eastAmount).approximately(9000, 1000);
    });

    it('должен выбросить ошибку при vectors.length = 0', () => {
      expect(() => stepTracker['getNextMovementVector']([], new Map())).toThrowError(
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
      const result = stepTracker['calcCoordinate']({
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
      const result = stepTracker['getNewCoordinates']({
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
      const result = stepTracker['getNewCoordinates']({
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
      const result = stepTracker['filterVectorKeys'](mockTried, mockAllowed);
      expect(result).toStrictEqual(expected);
    });

    describe('getNextPosition', () => {
      it('должен выбросить ошибку, если availableVectorKeys = []', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sequenceTrackerAny = stepTracker as unknown as any;
        vi.spyOn(sequenceTrackerAny, 'getAllowedVectorKeys').mockReturnValue([]);
        const mockCurrentVector = VectorKey.NORTH;
        const mockCurrentCoordinates = { x: 1, y: 1 } as DescartesCoordinatesType;
        const distance = 1;
        expect(() =>
          stepTracker.getNextPosition({
            currentVectorKey: mockCurrentVector,
            currentCoordinates: mockCurrentCoordinates,
            currentAcrVectorIndex: -1,
            distance,
          }),
        ).toThrowError('Unable to find next coordinates within bounds.');
      });
    });
  });
});
