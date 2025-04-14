import { MovementLibrary } from '../classes/MovementLibrary.js';
import { randomInt } from 'node:crypto';
import { Movement } from '../classes/Movement.js';
import { StepContext } from './StepContext.js';
import { Edge, Leg, TransitionDirection } from '../enums/movement-enums.js';

class StepSequenceGenerator {
  private readonly library: MovementLibrary;
  private readonly context: StepContext;
  private stepSequence: Movement[] = [];

  constructor(library: MovementLibrary, context: StepContext) {
    this.library = library;
    this.context = context;
    this.stepSequence = [];
  }

  generate(stepSequenceLength: number) {
    this.stepSequence = [];

    for (let i = 0; i < stepSequenceLength; i++) {
      const currentMovements = this.filterLibraryForNextStep();
      const index = this.getRandomIndex(currentMovements.length);
      this.context.currentStep = currentMovements[index];
      this.addStep(this.context.currentStep);
    }
    return this.stepSequence;
  }

  private filterLibraryForNextStep() {
    return this.library
      .filterByEdge(this.withDefault(this.context.currentEdge, Edge.TWO_EDGES))
      .filterByLeg(this.withDefault(this.context.currentLeg, Leg.BOTH))
      .filterByTransitionDirection(
        this.withDefault(
          this.context.currentDirection,
          TransitionDirection.NONE
        )
      ).movements;
  }

  private withDefault<T>(value: T | null | undefined, defaultValue: T): T {
    return value !== null && value !== undefined ? value : defaultValue;
  }

  private addStep(movement: Movement) {
    this.stepSequence.push(movement);
  }

  private getRandomIndex(max: number) {
    if (max <= 0) {
      // todo сделать пользовательский error
      throw new Error('Not enough maximum number of steps');
    }
    return randomInt(0, max);
  }
}

export { StepSequenceGenerator };
