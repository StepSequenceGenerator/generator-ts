import { Edge, Leg, TransitionDirection } from '../../shared/enums/movement-enums';

enum ArcVector {
  CLOCKWISE = 'CLOCKWISE',
  COUNTER_CLOCKWISE = 'COUNTER_CLOCKWISE',
  NONE = 'NONE',
}

type MapPointsType = Map<string, number>;

type ArcVectorIndexType = -1 | 0 | (1 & { __brand: 'stepDirectionIndex' });

function createArcDirectionIndex(value: number) {
  if ([-1, 0, 1].includes(value)) {
    return value as ArcVectorIndexType;
  } else {
    // todo сделать customError
    throw new Error('Unsupported step direction index');
  }
}

const STEP_POINTS: MapPointsType = new Map<TransitionDirection | Leg | Edge, 1 | -1>([
  [TransitionDirection.FORWARD, 1],
  [TransitionDirection.BACKWARD, -1],
  [Leg.RIGHT, 1],
  [Leg.LEFT, -1],
  [Edge.OUTER, 1],
  [Edge.INNER, -1],
]);

export { STEP_POINTS, ArcVector, createArcDirectionIndex };
export type { MapPointsType, ArcVectorIndexType };
