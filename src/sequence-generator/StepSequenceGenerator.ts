import { MovementLibrary } from '../classes/MovementLibrary.js';
import { randomInt } from 'node:crypto';
import { Movement } from '../classes/Movement.js';
import { Leg } from '../enums/movement-enums.js';

class StepSequenceGenerator {
  private readonly library: Movement[];
  private stepSequence: Movement[];
  private currentStep: Movement | null;

  constructor(library: MovementLibrary) {
    this.library = library.movements;
    this.stepSequence = [];
    this.currentStep = null;
  }

  generate(stepSequenceLength: number) {
    this.setFirstStep();
    for (let i = 0; i < stepSequenceLength; i++) {
      const stepIndex = this.getRandomIndex(this.library.length);
    }
    const firstStepIndex = randomInt(this.library.length);
    return firstStepIndex;
  }

  private filterLibraryForNextStep(currentStep: Movement) {
    return this.library.filter((movement) => {
      movement.startLeg;
    });
  }

  private getCurrentLeg() {
    if (this.currentStep) {
      if (
        this.currentStep.startLeg.length === 2 ||
        !this.currentStep.isChangeLeg
      ) {
        return this.currentStep.startLeg;
      } else {
        if (this.currentStep.isChangeLeg) {
          return this.currentStep.startLeg[0] === Leg.RIGHT
            ? [Leg.LEFT]
            : [Leg.RIGHT];
        } else {
          return this.currentStep.startLeg;
        }
      }
    } else {
      return [this.getRandomIndex(1) as Leg];
    }
  }

  private getCurrentEdge() {
    if (this.currentStep) {
    }
  }

  private setFirstStep() {
    const stepIndex = this.getRandomIndex(this.library.length);
    this.currentStep = this.library[stepIndex];
  }

  private getRandomIndex(max: number) {
    return randomInt(0, max);
  }
}

export { StepSequenceGenerator };
