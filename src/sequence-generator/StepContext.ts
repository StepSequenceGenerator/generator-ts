import { Movement } from '../classes/Movement.js';
import {
  Edge,
  Leg,
  RotationDegrees,
  RotationDirection,
  TranslationDirection,
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
    if (!this.currentStep) return TranslationDirection.NONE;

    const { rotationDirection, rotationDegree, translationDirection } =
      this.currentStep;

    if (rotationDirection === RotationDirection.NONE) {
      return translationDirection;
    }

    if (this.isFullTurn(rotationDegree)) {
      return translationDirection;
    }

    return translationDirection === TranslationDirection.BACKWARD
      ? TranslationDirection.FORWARD
      : TranslationDirection.BACKWARD;
  }

  private isFullTurn(degrees: RotationDegrees) {
    const FULL_TURN = 360;
    return degrees % FULL_TURN === 0;
  }
}

export { StepContext };
