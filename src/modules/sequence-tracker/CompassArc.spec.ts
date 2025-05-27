import { beforeEach, describe, expect, it } from 'vitest';
import { CompassArc } from './CompassArc';
import { Edge, Leg, TransitionDirection } from '../../shared/enums/movement-enums';

describe('CompassArc', () => {
  let compass: CompassArc;

  beforeEach(() => {
    compass = new CompassArc();
  });

  describe('implementation', () => {
    it('должен корректно создаваться', () => {
      expect(compass).toBeDefined();
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
        // eslint-disable-next-line
        const compassAny = compass as unknown as any;
        const expected = 1;
        const result = compassAny['calcStepPoints'](mockData);
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
        // eslint-disable-next-line
        const compassAny = compass as unknown as any;
        const expected = -1;
        const result = compassAny['calcStepPoints'](mockData);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('typifyToArcVectorIndex', () => {
    const mockDataList = [-1, 0, 1];

    it.each(mockDataList)(`при %s должен вернуть тоже число`, (mockData) => {
      // eslint-disable-next-line
      const compassAny = compass as unknown as any;
      const expected = mockData;
      const result = compassAny.typifyToArcVectorIndex(mockData);
      expect(result).toEqual(expected);
    });

    it('должен выбросить ошибку', () => {
      const compassAny = compass as unknown as any;
      const mockData = 5;
      expect(() => compassAny.typifyToArcVectorIndex(mockData)).toThrowError(
        'Unsupported step direction index',
      );
    });
  });
});
