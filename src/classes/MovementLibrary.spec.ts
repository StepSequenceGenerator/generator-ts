import { beforeEach, describe, expect, it } from 'vitest';
import { getFuncResult } from '../utils/test-utils/get-func-result.js';
import { Movement } from './Movement.js';
import { MovementLibrary } from './MovementLibrary.js';
import {
  Edge,
  Leg,
  RotationDirection,
  TransitionDirection,
} from '../enums/movement-enums.js';

describe('MovementLibrary', () => {
  let movementLibrary: MovementLibrary;
  const mockMovements: Movement[] = [
    { name: 'A', startLeg: Leg.LEFT } as Movement,
    { name: 'B', startLeg: Leg.RIGHT } as Movement,
  ];

  beforeEach(() => {
    movementLibrary = new MovementLibrary(mockMovements);
  });

  describe('implementation', () => {
    it('должен корректно создаваться', () => {
      expect(movementLibrary).toBeDefined();
      expect(movementLibrary).toBeInstanceOf(MovementLibrary);
    });
  });

  describe('create', () => {
    it('должен вернуть имплиментацию MovementLibrary', () => {
      const result = movementLibrary.create(mockMovements);
      expect(result).toBeInstanceOf(MovementLibrary);
    });
  });

  describe('filterBy', () => {
    it('должен вернуть шаг с Leg.LEFT', () => {
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

  // todo изменить все фильтры, чтобы всегда отдавать movement с NONE или BOTH

  describe('filterByLeg', () => {
    const mockMovements: Movement[] = [
      { name: 'A', startLeg: Leg.LEFT } as Movement,
      { name: 'B', startLeg: Leg.RIGHT } as Movement,
      { name: 'B', startLeg: Leg.BOTH } as Movement,
    ];

    beforeEach(() => {
      movementLibrary = new MovementLibrary(mockMovements);
    });

    it('должен вернуть массив с movement с Leg.LEFT и Leg.BOTH', () => {
      const input = Leg.LEFT;
      const expected = [
        { name: 'A', startLeg: Leg.LEFT },
        { name: 'B', startLeg: Leg.BOTH },
      ];
      const result = getFuncResult<MovementLibrary>(
        movementLibrary,
        'filterByLeg',
        input
      );
      expect(result.movements).toEqual(expected);
    });

    it('должен вернуть массив с movement с Leg.RIGHT и Leg.BOTH', () => {
      const input = Leg.RIGHT;
      const expected = [
        { name: 'B', startLeg: Leg.RIGHT },
        { name: 'B', startLeg: Leg.BOTH },
      ];
      const result = getFuncResult<MovementLibrary>(
        movementLibrary,
        'filterByLeg',
        input
      );
      expect(result.movements).toEqual(expected);
    });

    it('должен вернуть массив без фильтрации', () => {
      const input = Leg.BOTH;
      const expected = mockMovements;
      const result = getFuncResult<MovementLibrary>(
        movementLibrary,
        'filterByLeg',
        input
      );
      expect(result.movements).toEqual(expected);
    });
  });

  describe('filterByEdge', () => {
    const mockMovements: Movement[] = [
      { startEdge: Edge.INNER } as Movement,
      { startEdge: Edge.OUTER } as Movement,
      { startEdge: Edge.TWO_EDGES } as Movement,
    ];

    beforeEach(() => {
      movementLibrary = new MovementLibrary(mockMovements);
    });

    it('должен вернуть массив с Edge.INNER и Edge.TWO_EDGES', () => {
      const input = Edge.INNER;
      const expected = [
        { startEdge: Edge.INNER },
        { startEdge: Edge.TWO_EDGES },
      ];
      const result = getFuncResult<MovementLibrary>(
        movementLibrary,
        'filterByEdge',
        input
      );
      expect(result.movements).toEqual(expected);
    });

    it('должен вернуть массив с Edge.INNER и Edge.TWO_EDGES', () => {
      const input = Edge.INNER;
      const expected = [
        { startEdge: Edge.INNER },
        { startEdge: Edge.TWO_EDGES },
      ];
      const result = getFuncResult<MovementLibrary>(
        movementLibrary,
        'filterByEdge',
        input
      );
      expect(result.movements).toEqual(expected);
    });

    it('должен вернуть массив без изменений', () => {
      const input = Edge.TWO_EDGES;
      const expected = mockMovements;
      const result = getFuncResult<MovementLibrary>(
        movementLibrary,
        'filterByEdge',
        input
      );
      expect(result.movements).toEqual(expected);
    });
  });

  describe('filterByTransitionDirection', () => {
    const mockMovements: Movement[] = [
      { transitionDirection: TransitionDirection.BACKWARD } as Movement,
      { transitionDirection: TransitionDirection.FORWARD } as Movement,
      { transitionDirection: TransitionDirection.NONE } as Movement,
    ];

    beforeEach(() => {
      movementLibrary = new MovementLibrary(mockMovements);
    });

    it('должен вернуть массив с TransitionDirection.BACKWARD и TransitionDirection.NONE', () => {
      const input = TransitionDirection.BACKWARD;
      const expected = [
        { transitionDirection: TransitionDirection.BACKWARD },
        { transitionDirection: TransitionDirection.NONE },
      ];
      const result = getFuncResult<MovementLibrary>(
        movementLibrary,
        'filterByTransitionDirection',
        input
      );
      expect(result.movements).toEqual(expected);
    });

    it('должен вернуть массив с TransitionDirection.FORWARD и TransitionDirection.NONE', () => {
      const input = TransitionDirection.FORWARD;
      const expected = [
        { transitionDirection: TransitionDirection.FORWARD },
        { transitionDirection: TransitionDirection.NONE },
      ];
      const result = getFuncResult<MovementLibrary>(
        movementLibrary,
        'filterByTransitionDirection',
        input
      );
      expect(result.movements).toEqual(expected);
    });

    it('должен вернуть массив без изменений', () => {
      const input = TransitionDirection.NONE;
      const expected = mockMovements;
      const result = getFuncResult<MovementLibrary>(
        movementLibrary,
        'filterByTransitionDirection',
        input
      );
      expect(result.movements).toEqual(expected);
    });
  });

  describe('filterByRotationDirection', () => {
    const mockMovements: Movement[] = [
      { rotationDirection: RotationDirection.CLOCKWISE } as Movement,
      { rotationDirection: RotationDirection.COUNTERCLOCKWISE } as Movement,
      { rotationDirection: RotationDirection.NONE } as Movement,
    ];

    beforeEach(() => {
      movementLibrary = new MovementLibrary(mockMovements);
    });

    it('должен вернуть массив с RotationDirection.CLOCKWISE и RotationDirection.NONE', () => {
      const input = RotationDirection.CLOCKWISE;
      const expected = [
        { rotationDirection: RotationDirection.CLOCKWISE },
        { rotationDirection: RotationDirection.NONE },
      ];
      const result = getFuncResult<MovementLibrary>(
        movementLibrary,
        'filterByRotationDirection',
        input
      );
      expect(result.movements).toEqual(expected);
    });

    it('должен вернуть массив с RotationDirection.COUNTERCLOCKWISE и RotationDirection.NONE', () => {
      const input = RotationDirection.COUNTERCLOCKWISE;
      const expected = [
        { rotationDirection: RotationDirection.COUNTERCLOCKWISE },
        { rotationDirection: RotationDirection.NONE },
      ];
      const result = getFuncResult<MovementLibrary>(
        movementLibrary,
        'filterByRotationDirection',
        input
      );
      expect(result.movements).toEqual(expected);
    });

    it('должен вернуть массив без изменений', () => {
      const input = RotationDirection.NONE;
      const expected = mockMovements;
      const result = getFuncResult<MovementLibrary>(
        movementLibrary,
        'filterByRotationDirection',
        input
      );
      expect(result.movements).toEqual(expected);
    });
  });
});
