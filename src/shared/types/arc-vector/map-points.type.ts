import { Edge, Leg, TransitionDirection } from '../../enums/movement-enums';

type BaseMapPointsType<T> = Map<T, number>;
type MovementMapPointsType = BaseMapPointsType<Leg | TransitionDirection | Edge>;

export type { BaseMapPointsType, MovementMapPointsType };
