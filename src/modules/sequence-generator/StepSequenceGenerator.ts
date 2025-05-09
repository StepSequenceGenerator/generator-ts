import { MovementLibrary } from '../movement/MovementLibrary.js';
import { randomInt } from 'node:crypto';
import { Movement } from '../movement/Movement.js';
import { StepContext } from './StepContext.js';
import {
  Edge,
  ExtendedMovementCharacter,
  Leg,
  TransitionDirection,
} from '../../shared/enums/movement-enums.js';
import { StepCounter } from './StepCounter.js';
import { DifficultLevelAmountStep } from '../../shared/enums/difficult-level-amount-step-enum.js';
import { RouletteGenerator } from '../roulette/RouletteGenerator.js';
import { ChanceRatioMapType } from '../../shared/types/chance-ratio-map-type.js';
import { TurnAbsoluteName } from '../../shared/enums/turn-absolute-name-enum.js';
import { StepTracker } from '../sequence-tracker/StepTracker';
import {
  IMovementCoordinates,
  IMovementExtended,
} from '../../shared/types/movement-extended.interface';
import { MovementExtendedFactory } from '../movement/MovementExtendedFactory';

const chanceRatioMap: ChanceRatioMapType = new Map<ExtendedMovementCharacter, number>([
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
  private readonly context: StepContext<IMovementExtended>;
  private readonly counter: StepCounter;
  private readonly randomGenerator: RouletteGenerator;
  private stepSequence: IMovementExtended[] = [];
  private tracker: StepTracker;

  constructor(
    library: MovementLibrary,
    context: StepContext<IMovementExtended>,
    counter: StepCounter,
    randomGenerator: RouletteGenerator,
    tracker: StepTracker,
  ) {
    this.library = library;
    this.context = context;
    this.counter = counter;
    this.randomGenerator = randomGenerator;
    this.stepSequence = [];
    this.tracker = tracker;
  }

  public generate(stepAmountBySequenceLevel: DifficultLevelAmountStep) {
    this.resetGenerator();

    while (this.counter.difficultTurnsOriginAmount < stepAmountBySequenceLevel) {
      let currentLibrary: MovementLibrary;
      if (this.isTimeToInsertThreeTurnsBlock()) {
        this.generateThreeTurnsBlock();
      } else {
        currentLibrary = this.filterLibraryForNextStep();
        const newMovement = this.generateMovement(currentLibrary.movements);
        const newCoordinates: IMovementCoordinates = this.getCoordinates(newMovement);
        const movementExtended = MovementExtendedFactory.createMovementExtended({
          movement: newMovement,
          coordinates: newCoordinates,
        });
        this.context.currentStep = movementExtended;
        this.addStepToSequence(movementExtended);
        this.counter.update(movementExtended);
      }
    }
    return this.stepSequence;
  }

  private getCoordinates(newMovement: Movement): IMovementCoordinates {
    const currentCoordinates = this.context.endCoordinate || this.tracker.getStartCoordinates();
    const vector = this.context.vector;
    const coordinates = this.tracker.getNextPosition(
      vector,
      currentCoordinates,
      newMovement.distance,
    );

    return {
      coordinates: {
        vector: coordinates.vector,
        start: currentCoordinates,
        end: coordinates.coordinates,
      },
    };
  }

  private resetGenerator() {
    this.stepSequence = [];
    this.counter.resetCounter();
    this.context.resetCurrentStep();
  }

  private isTimeToInsertThreeTurnsBlock() {
    return this.counter.threeTurnsBlockAmount < 2 ? this.getRandomIndex(2) === 1 : false;
  }

  private generateThreeTurnsBlock() {
    for (let i = 0; i < 3; i++) {
      const currentLibrary = this.filterForThreeTurnsBlock(this.filterLibraryForNextStep());

      this.generateMovement(currentLibrary.movements);
      this.counter.updateThreeTurnsBlockOrigin(
        this.context.currentStep?.absoluteName || TurnAbsoluteName.UNKNOWN,
      );
    }
    this.counter.increaseThreeTurnsBlockAmount();
  }

  private filterForThreeTurnsBlock(movementLibrary: MovementLibrary) {
    const unusedTurns = this.counter.unusedDifficultTurns;
    return movementLibrary
      .filterDifficultTurns()
      .filterBy((movement: Movement) => unusedTurns.includes(movement.absoluteName));
  }

  private generateMovement(movements: Movement[]) {
    const movementIndex = this.randomGenerator.generateNumber(movements, chanceRatioMap);
    return movements[movementIndex];
  }

  private filterLibraryForNextStep() {
    return this.library
      .filterByEdge(this.withDefault(this.context.currentEdge, Edge.TWO_EDGES))
      .filterByLeg(this.withDefault(this.context.currentLeg, Leg.BOTH))
      .filterByTransitionDirection(
        this.withDefault(this.context.currentDirection, TransitionDirection.NONE),
      );
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

  private addStepToSequence(movement: IMovementExtended) {
    this.stepSequence.push(movement);
  }
}

export { StepSequenceGenerator };
