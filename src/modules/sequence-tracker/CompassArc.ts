import { Edge, Leg, TransitionDirection } from '../../shared/enums/movement-enums';
import { ArcVector } from '../../shared/enums/arc-vector.enum';
import { MovementMapPointsType } from '../../shared/types/arc-vector/map-points.type';
import { createArcVectorIndex } from '../../utils/create-arc-vector-index';
import { ArcVectorIndexType } from '../../shared/types/arc-vector/arc-vector-index.type';

type ArgsType = {
  transitionDirection: TransitionDirection;
  leg: Leg;
  edge: Edge;
};

export class CompassArc {
  private readonly points: MovementMapPointsType;
  private readonly vectors: typeof ArcVector;

  constructor(data: { stepPoints: MovementMapPointsType; arcVector: typeof ArcVector }) {
    const { stepPoints, arcVector } = data;
    this.points = stepPoints;
    this.vectors = arcVector;
  }

  public getArcVector(data: ArgsType): ArcVector {
    const vectorIndex = this.calcStepPoints(data);
    const arcVectorIndex = this.typifyToArcVectorIndex(vectorIndex);
    return this.mapAcrVector(arcVectorIndex);
  }

  private calcStepPoints(data: ArgsType): number {
    return Object.values(data)
      .map((item) => this.points.get(item) || 0)
      .reduce((a, b) => a * b);
  }

  private typifyToArcVectorIndex(value: number) {
    return createArcVectorIndex(value);
  }

  private mapAcrVector(index: ArcVectorIndexType): ArcVector {
    switch (index) {
      case -1:
        return this.vectors.COUNTER_CLOCKWISE;
      case 1:
        return this.vectors.CLOCKWISE;
      default:
        return this.vectors.NONE;
    }
  }
}
