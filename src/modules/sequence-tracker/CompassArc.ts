import {
  ArcVector,
  ArcVectorIndexType,
  createArcDirectionIndex,
  MapPointsType,
} from './arc-vector.enum';
import { Edge, Leg, TransitionDirection } from '../../shared/enums/movement-enums';

type ArgsType = {
  transitionDirection: TransitionDirection;
  leg: Leg;
  edge: Edge;
};

export class CompassArc {
  private readonly points: MapPointsType;
  private readonly vectors: typeof ArcVector;

  constructor(data: { stepPoints: MapPointsType; arcVector: typeof ArcVector }) {
    const { stepPoints, arcVector } = data;
    this.points = stepPoints;
    this.vectors = arcVector;
  }

  public getArcVector(data: ArgsType): ArcVector {
    const vectorIndex = this.calcArcVectorIndexUntyped(data);
    const arcVectorIndex = this.typifyToArcVectorIndex(vectorIndex);
    return this.mapAcrVector(arcVectorIndex);
  }

  private calcArcVectorIndexUntyped(data: ArgsType): number {
    return Object.values(data)
      .map((item) => this.points.get(item) || 0)
      .reduce((a, b) => a * b);
  }

  private typifyToArcVectorIndex(value: number) {
    return createArcDirectionIndex(value);
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
