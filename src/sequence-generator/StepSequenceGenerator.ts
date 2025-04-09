import { MovementLibrary } from '../classes/MovementLibrary.js';
import { randomInt } from 'node:crypto';
import { Movement } from '../classes/Movement.js';
import { Edge, Leg } from '../enums/movement-enums.js';

class StepSequenceGenerator {
  private readonly library: MovementLibrary;
  private stepSequence: Movement[];
  private currentStep: Movement | null;

  constructor(library: MovementLibrary) {
    this.library = library;
    this.stepSequence = [];
    this.currentStep = null;
  }

  generate(stepSequenceLength: number) {
    this.stepSequence = [];
    this.setFirstStep();
    if (this.currentStep) this.stepSequence.push(this.currentStep);

    for (let i = 0; i < stepSequenceLength; i++) {
      const currentMovements = this.filterLibraryForNextStep();
      console.log(
        'filtered: ',
        currentMovements.map((movement: Movement) => movement.name)
      );
      const index = this.getRandomIndex(currentMovements.length);
      this.currentStep = currentMovements[index];
      this.addStep(this.currentStep);
      console.log('currentStep: ', this.currentStep.name);
    }

    return this.stepSequence.map((step: Movement) => step.name);
  }

  private filterLibraryForNextStep() {
    return this.library
      .filterByEdge(this.getCurrentEdge())
      .filterByLeg(this.getCurrentLeg()).movements;
  }

  private getCurrentLeg() {
    return this.currentStep
      ? this.currentStep.startLeg
      : (this.getRandomIndex(2) as Leg);
  }

  private getCurrentEdge() {
    return this.currentStep
      ? this.currentStep.startEdge
      : (this.getRandomIndex(2) as Edge);
  }

  private setFirstStep() {
    const stepIndex = this.getRandomIndex(this.library.movements.length);
    this.currentStep = this.library.movements[stepIndex];
  }

  private addStep(movement: Movement) {
    this.stepSequence.push(movement);
  }

  private getRandomIndex(max: number) {
    return randomInt(0, max);
  }
}

export { StepSequenceGenerator };
