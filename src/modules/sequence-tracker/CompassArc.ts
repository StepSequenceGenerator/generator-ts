import { Edge, Leg, TransitionDirection } from '../../shared/enums/movement-enums';
import { MovementMapPointsType } from '../../shared/types/arc-vector/map-points.type';
import { createArcVectorIndex } from '../../utils/create-arc-vector-index';
import { ArcVectorIndexType } from '../../shared/types/arc-vector/arc-vector-index.type';
import { MOVEMENT_POINTS } from '../../shared/constants/movement-points.const';

type ArgsType = {
  transitionDirection: TransitionDirection;
  leg: Leg;
  edge: Edge;
};

export class CompassArc {
  private static readonly points: MovementMapPointsType = MOVEMENT_POINTS;

  // todo test
  public static getArcVectorIndex(data: ArgsType): ArcVectorIndexType {
    const vectorIndex = this.calcStepPoints(data);
    return this.typifyToArcVectorIndex(vectorIndex);
  }

  private static calcStepPoints(data: ArgsType): number {
    return Object.values(data)
      .map((item) => this.points.get(item) || 0)
      .reduce((a, b) => a * b);
  }

  private static typifyToArcVectorIndex(value: number) {
    return createArcVectorIndex(value);
  }
}
