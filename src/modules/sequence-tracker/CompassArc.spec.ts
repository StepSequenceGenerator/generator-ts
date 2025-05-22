import { beforeEach, describe, expect, it } from 'vitest';
import { CompassArc } from './CompassArc';
import { ArcVector, ArcVectorIndexType, STEP_POINTS } from './arc-vector.enum';
import { Edge, Leg, TransitionDirection } from '../../shared/enums/movement-enums';

describe('CompassArc', () => {
  let compass: CompassArc;

  beforeEach(() => {
    compass = new CompassArc({ stepPoints: STEP_POINTS, arcVector: ArcVector });
  });

  describe('implementation', () => {
    it('должен корректно создаваться', () => {
      expect(compass).toBeDefined();
    });
  });

  describe('mapAcrVector', () => {
    const mockAndExpectedList = [
      { value: -1 as ArcVectorIndexType, expected: ArcVector.COUNTER_CLOCKWISE },
      { value: 0 as ArcVectorIndexType, expected: ArcVector.NONE },
      { value: 1 as ArcVectorIndexType, expected: ArcVector.CLOCKWISE },
    ];
    it.each(mockAndExpectedList)('должен вернуть %s', ({ value, expected }) => {
      const result = compass['mapAcrVector'](value);
      expect(result).toEqual(expected);
    });
  });

  describe('calcArcVectorIndexUntyped', () => {
    describe('должен вернуть 1', () => {
      const mockDataList = [
        {
          leg: Leg.RIGHT,
          edge: Edge.OUTER,
          transitionDirection: TransitionDirection.FORWARD,
        },
        {
          leg: Leg.LEFT,
          edge: Edge.INNER,
          transitionDirection: TransitionDirection.FORWARD,
        },
        {
          leg: Leg.RIGHT,
          edge: Edge.INNER,
          transitionDirection: TransitionDirection.BACKWARD,
        },
        {
          leg: Leg.LEFT,
          edge: Edge.OUTER,
          transitionDirection: TransitionDirection.BACKWARD,
        },
      ];

      it.each(mockDataList)('при %s должен вернуть 1', (mockData) => {
        const expected = 1;
        const result = compass['calcArcVectorIndexUntyped'](mockData);
        expect(result).toEqual(expected);
      });
    });

    describe('должен вернуть -1', () => {
      const mockDataList = [
        {
          leg: Leg.RIGHT,
          edge: Edge.INNER,
          transitionDirection: TransitionDirection.FORWARD,
        },
        {
          leg: Leg.LEFT,
          edge: Edge.OUTER,
          transitionDirection: TransitionDirection.FORWARD,
        },
        {
          leg: Leg.RIGHT,
          edge: Edge.OUTER,
          transitionDirection: TransitionDirection.BACKWARD,
        },
        {
          leg: Leg.LEFT,
          edge: Edge.INNER,
          transitionDirection: TransitionDirection.BACKWARD,
        },
      ];

      it.each(mockDataList)('при %s должен вернуть -1', (mockData) => {
        const expected = -1;
        const result = compass['calcArcVectorIndexUntyped'](mockData);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('typifyToArcVectorIndex', () => {
    const mockDataList = [-1, 0, 1];

    it.each(mockDataList)(`при %s должен вернуть тоже число`, (mockData) => {
      const expected = mockData;
      const result = compass['typifyToArcVectorIndex'](mockData);
      expect(result).toEqual(expected);
    });

    it('должен выбросить ошибку', () => {
      const mockData = 5;
      expect(() => compass['typifyToArcVectorIndex'](mockData)).toThrowError(
        'Unsupported step direction index',
      );
    });
  });
});
