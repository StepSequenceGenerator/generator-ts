import { MovementLibrary } from '../movement/MovementLibrary.js';
import { randomInt } from 'node:crypto';
import { Movement } from '../movement/Movement.js';
import { StepContext } from './StepContext.js';
import {
  Edge,
  ExtendedMovementCharacter,
  Leg,
  TransitionDirection,
} from '../enums/movement-enums.js';
import { StepCounter } from './StepCounter.js';
import { DifficultLevelAmountStep } from '../enums/difficult-level-amount-step-enum.js';
import { RouletteGenerator } from './RouletteGenerator.js';
import { ChanceRatioMapType } from '../shared/types/chance-ratio-map-type.js';

const chanceRatioMap: ChanceRatioMapType = new Map<
  ExtendedMovementCharacter,
  number
>([
  [ExtendedMovementCharacter.STEP, 8],
  [ExtendedMovementCharacter.TURN, 9],
  [ExtendedMovementCharacter.SEQUENCE, 9],
  [ExtendedMovementCharacter.HOP, 8],
  [ExtendedMovementCharacter.GLIDE, 8],
  [ExtendedMovementCharacter.UNKNOWN, 8],
  [ExtendedMovementCharacter.DIFFICULT, 50],
]);

class StepSequenceGenerator {
  private readonly library: MovementLibrary;
  private readonly context: StepContext;
  private readonly counter: StepCounter;
  private readonly randomGenerator: RouletteGenerator;
  private stepSequence: Movement[] = [];

  constructor(
    library: MovementLibrary,
    context: StepContext,
    counter: StepCounter,
    randomGenerator: RouletteGenerator
  ) {
    this.library = library;
    this.context = context;
    this.counter = counter;
    this.randomGenerator = randomGenerator;
    this.stepSequence = [];
  }

  public generate(stepAmountBySequenceLevel: DifficultLevelAmountStep) {
    this.stepSequence = [];

    while (
      this.counter.difficultTurnsOriginAmount < stepAmountBySequenceLevel
    ) {
      const currentMovementsForChoice = this.filterLibraryForNextStep();
      const movementIndex = this.randomGenerator.generateNumber(
        currentMovementsForChoice,
        chanceRatioMap
      );
      this.context.currentStep = currentMovementsForChoice[movementIndex];
      this.addStepToSequence(this.context.currentStep);
      this.counter.update(this.context.currentStep);
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

  private getRandomIndex(max: number) {
    if (max <= 0) {
      // todo сделать пользовательский error
      throw new Error('Not enough maximum number of steps');
    }
    return randomInt(0, max);
  }

  private addStepToSequence(movement: Movement) {
    this.stepSequence.push(movement);
  }
}

export { StepSequenceGenerator };
