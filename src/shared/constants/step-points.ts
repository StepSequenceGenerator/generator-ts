import { Edge, Leg, TransitionDirection } from '../enums/movement-enums';
import { MovementMapPointsType } from '../types/arc-vector/map-points.type';

export const MOVEMENT_POINTS: MovementMapPointsType = new Map<
  TransitionDirection | Leg | Edge,
  1 | -1
>([
  [TransitionDirection.FORWARD, 1],
  [TransitionDirection.BACKWARD, -1],
  [Leg.RIGHT, 1],
  [Leg.LEFT, -1],
  [Edge.OUTER, 1],
  [Edge.INNER, -1],
]);
