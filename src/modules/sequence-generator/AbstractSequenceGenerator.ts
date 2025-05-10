import {
  IMovementCoordinates,
  IMovementExtended,
} from '../../shared/types/movement-extended.interface';
import { MovementLibrary } from '../movement/MovementLibrary';
import { StepContext } from './StepContext';
import { RouletteGenerator } from '../roulette/RouletteGenerator';
import { StepTracker } from '../sequence-tracker/StepTracker';
import { BaseCompositeMovementFilters } from '../filter-strategy/BaseCompositeMovementFilters';
import { IStepCounter } from '../../shared/types/abstract-step-counter.interface';
import { Movement } from '../movement/Movement';
import { CHANCE_RATIO_MAP } from '../../shared/constants/chance-ratio-map.const';
import { MovementExtendedFactory } from '../movement/MovementExtendedFactory';
import { randomGenerator } from '../../utils/random-generator';

export abstract class AbstractSequenceGenerator<C extends IStepCounter> {
  protected stepSequence: IMovementExtended[];
  protected readonly library: MovementLibrary;
  protected readonly context: StepContext<IMovementExtended>;
  protected readonly counter: C;
  protected readonly randomGenerator: RouletteGenerator;
  protected readonly tracker: StepTracker;
  protected readonly filterStrategy: BaseCompositeMovementFilters;

  protected constructor(data: {
    library: MovementLibrary;
    context: StepContext<IMovementExtended>;
    counter: C;
    randomGenerator: RouletteGenerator;
    tracker: StepTracker;
    filterStrategy: BaseCompositeMovementFilters;
  }) {
    const { library, context, counter, randomGenerator, tracker, filterStrategy } = data;
    this.stepSequence = [];
    this.library = library;
    this.context = context;
    this.counter = counter;
    this.randomGenerator = randomGenerator;
    this.tracker = tracker;
    this.filterStrategy = filterStrategy;
  }

  abstract generate(args: unknown): IMovementExtended[];

  protected generateMovement(): IMovementExtended {
    const currentLibrary = this.getCurrentLibrary();
    const newMovement = this.chooseMovement(currentLibrary.movements);
    const newCoordinates: IMovementCoordinates = this.getCoordinates(newMovement);

    return MovementExtendedFactory.createMovementExtended({
      movement: newMovement,
      coordinates: newCoordinates,
    });
  }

  protected chooseMovement(movements: Movement[]) {
    const movementIndex = this.randomGenerator.generateNumber(movements, CHANCE_RATIO_MAP);
    return movements[movementIndex];
  }

  protected getCurrentLibrary(): MovementLibrary {
    return this.filterStrategy.filter(this.library, this.context);
  }

  public reset(): void {
    this.stepSequence = [];
    this.counter.reset();
    this.context.resetCurrentStep();
  }

  protected update(movementExtended: IMovementExtended): void {
    this.contextUpdate(movementExtended);
    this.counterUpdate(movementExtended);
    this.stepSequenceUpdate(movementExtended);
  }

  protected contextUpdate(movementExtended: IMovementExtended): void {
    this.context.currentStep = movementExtended;
  }

  protected counterUpdate(movementExtended: IMovementExtended): void {
    this.counter.update(movementExtended);
  }

  protected stepSequenceUpdate(movement: IMovementExtended): void {
    this.stepSequence.push(movement);
  }

  protected getCoordinates(newMovement: Movement): IMovementCoordinates {
    const currentCoordinates = this.context.endCoordinate || this.tracker.getStartCoordinates();
    const vector = this.context.vector;

    const coordinates = this.tracker.getNextPosition(
      vector,
      currentCoordinates,
      newMovement.distance,
    );

    console.debug(coordinates);

    return {
      coordinates: {
        vector: coordinates.vector,
        start: currentCoordinates,
        end: coordinates.coordinates,
      },
    };
  }

  protected getRandomIndex(max: number) {
    const min = 0;
    return randomGenerator(min, max);
  }
}
