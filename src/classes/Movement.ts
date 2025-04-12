import {
  Edge,
  Leg,
  RotationDegrees,
  RotationDirection,
  TransitionDirection,
} from '../enums/movement-enums.js';

export interface IMovement {
  readonly id: string;
  readonly name: string;

  readonly transitionDirection: TransitionDirection;

  readonly rotationDirection: RotationDirection;
  readonly rotationDegree: RotationDegrees;

  readonly startLeg: Leg;
  readonly endLeg: Leg;
  readonly isChangeLeg: boolean;

  readonly startEdge: Edge;
  readonly endEdge: Edge;
  readonly isChangeEdge: boolean;

  readonly isSpeedIncrease: boolean;
}

export class Movement implements IMovement {
  readonly id: string;
  readonly name: string;
  readonly transitionDirection: TransitionDirection;
  readonly rotationDirection: RotationDirection;
  readonly rotationDegree: RotationDegrees;
  readonly startLeg: Leg;
  readonly endLeg: Leg;
  readonly isChangeLeg: boolean;
  readonly startEdge: Edge;
  readonly endEdge: Edge;
  readonly isChangeEdge: boolean;
  readonly isSpeedIncrease: boolean;

  constructor(private readonly movement: IMovement) {
    this.id = movement.id;
    this.name = movement.name;
    this.transitionDirection = movement.transitionDirection;
    this.rotationDirection = movement.rotationDirection;
    this.rotationDegree = movement.rotationDegree;
    this.startLeg = movement.startLeg;
    this.endLeg = movement.endLeg;
    this.isChangeLeg = movement.isChangeLeg;
    this.startEdge = movement.startEdge;
    this.endEdge = movement.endEdge;
    this.isChangeEdge = movement.isChangeEdge;
    this.isSpeedIncrease = movement.isSpeedIncrease;
  }
}
