import { MovementLibrary } from '../movement/MovementLibrary.js';
import { randomInt } from 'node:crypto';
import { Movement } from '../movement/Movement.js';
import { StepContext } from './StepContext.js';
import { StepCounter } from './StepCounter.js';
import { DifficultLevelAmountStep } from '../../shared/enums/difficult-level-amount-step-enum.js';
import { RouletteGenerator } from '../roulette/RouletteGenerator.js';
import { TurnAbsoluteName } from '../../shared/enums/turn-absolute-name-enum.js';
import { StepTracker } from '../sequence-tracker/StepTracker';
import {
  IMovementCoordinates,
  IMovementExtended,
} from '../../shared/types/movement-extended.interface';
import { MovementExtendedFactory } from '../movement/MovementExtendedFactory';
import { IGeneratorExtendedFilterStrategy } from '../filter-strategy/BaseCompositeMovementFilters';

import { CHANCE_RATIO_MAP } from '../../shared/constants/chance-ratio-map.const.js';

class StepSequenceGenerator {
  private stepSequence: IMovementExtended[] = [];
  private readonly library: MovementLibrary;
  private readonly context: StepContext<IMovementExtended>;
  private readonly counter: StepCounter;
  private readonly randomGenerator: RouletteGenerator;
  private tracker: StepTracker;
  private filterStrategy: IGeneratorExtendedFilterStrategy;

  constructor(
    library: MovementLibrary,
    context: StepContext<IMovementExtended>,
    counter: StepCounter,
    randomGenerator: RouletteGenerator,
    tracker: StepTracker,
    filterStrategy: IGeneratorExtendedFilterStrategy,
  ) {
    this.library = library;
    this.context = context;
    this.counter = counter;
    this.randomGenerator = randomGenerator;
    this.stepSequence = [];
    this.tracker = tracker;
    this.filterStrategy = filterStrategy;
  }

  public generate(stepAmountBySequenceLevel: DifficultLevelAmountStep) {
    this.resetGenerator();

    while (this.counter.difficultTurnsOriginAmount < stepAmountBySequenceLevel) {
      let currentLibrary: MovementLibrary;
      if (this.isTimeToInsertThreeTurnsBlock()) {
        this.generateThreeTurnsBlock();
      } else {
        currentLibrary = this.filterStrategy.default.filter(this.library, this.context);
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
    this.counter.reset();
    this.context.resetCurrentStep();
  }

  private isTimeToInsertThreeTurnsBlock() {
    return this.counter.threeTurnsBlockAmount < 2 ? this.getRandomIndex(2) === 1 : false;
  }

  private generateThreeTurnsBlock() {
    for (let i = 0; i < 3; i++) {
      const currentLibrary = this.filterStrategy.difficultTurns.filter(this.library, this.context);

      this.generateMovement(currentLibrary.movements);
      this.counter.updateThreeTurnsBlockOrigin(
        this.context.currentStep?.absoluteName || TurnAbsoluteName.UNKNOWN,
      );
    }
    this.counter.increaseThreeTurnsBlockAmount();
  }

  private generateMovement(movements: Movement[]) {
    const movementIndex = this.randomGenerator.generateNumber(movements, CHANCE_RATIO_MAP);
    return movements[movementIndex];
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
