import { Edge, Leg, TransitionDirection } from '../enums/movement-enums';
import { MovementMapPointsType } from '../types/arc-vector/map-points.type';

/**
 * За каждый параметр дуги дается 1 или -1.
 * При перемножении всех трех параметров получается 1 или -1
 * 1 соответствует направлению по часовой стрелки
 * -1 соответствует направлению против часовой стрелки
 *
 * Используется для калькуляции в CompassAcr
 * */
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
