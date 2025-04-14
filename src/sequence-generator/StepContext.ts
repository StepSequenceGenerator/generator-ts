import { Movement } from '../classes/Movement.js';
import {
  Edge,
  Leg,
  RotationDegree,
  RotationDirection,
  TransitionDirection,
} from '../enums/movement-enums.js';

class StepContext {
  private _currentStep: Movement | null = null;

  set currentStep(step: Movement) {
    this._currentStep = step;
  }

  get currentStep(): Movement | null {
    return this._currentStep;
  }

  get currentLeg() {
    return this.currentStep ? this.currentStep.endLeg : Leg.BOTH;
  }

  get currentEdge() {
    return this.currentStep ? this.currentStep.endEdge : Edge.TWO_EDGES;
  }

  get currentDirection() {
    if (this.currentStep === null) return TransitionDirection.NONE;

    const { rotationDirection, rotationDegree, transitionDirection } =
      this.currentStep;

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
