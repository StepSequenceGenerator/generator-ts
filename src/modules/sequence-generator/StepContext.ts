import {
  Edge,
  Leg,
  RotationDegree,
  RotationDirection,
  TransitionDirection,
} from '../../shared/enums/movement-enums.js';
import { CoordinatesType } from '../../shared/types/coordinates-type';
import { IMovementExtended } from '../../shared/types/movement-extended.interface';

class StepContext<T extends IMovementExtended> {
  private _currentStep: T | null = null;

  resetCurrentStep() {
    this._currentStep = null;
  }

  set currentStep(step: T) {
    this._currentStep = step;
  }

  get currentStep(): T | null {
    return this._currentStep;
  }

  get endCoordinate(): CoordinatesType | null {
    return this._currentStep === null ? null : this._currentStep.coordinates.end;
  }

  get vector() {
    return this._currentStep === null ? null : this._currentStep.coordinates.vector;
  }

  get currentLeg() {
    return this.currentStep ? this.currentStep.endLeg : Leg.BOTH;
  }

  get currentEdge() {
    return this.currentStep ? this.currentStep.endEdge : Edge.TWO_EDGES;
  }

  get currentDirection() {
    if (this.currentStep === null) return TransitionDirection.NONE;

    const { rotationDirection, rotationDegree, transitionDirection } = this.currentStep;

    if (rotationDirection === RotationDirection.NONE) {
      return transitionDirection;
    }

    if (this.isFullTurn(rotationDegree)) {
      return transitionDirection;
    }

    return transitionDirection === TransitionDirection.BACKWARD
      ? TransitionDirection.FORWARD
      : TransitionDirection.BACKWARD;
  }

  private isFullTurn(degrees: RotationDegree) {
    const FULL_TURN = 360;
    return degrees % FULL_TURN === 0;
  }
}

export { StepContext };
