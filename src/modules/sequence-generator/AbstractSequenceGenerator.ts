import {
  IMovementCoordinates,
  IMovementExtended,
} from '../../shared/types/movement-extended.interface';
import { MovementLibrary } from '../movement/MovementLibrary';
import { StepContext } from './StepContext';
import { RouletteGenerator } from '../roulette/RouletteGenerator';
import { StepTracker } from '../sequence-tracker/StepTracker';
import {
  BaseCompositeMovementFilters,
  IGeneratorFilterStrategy,
} from '../filter-strategy/BaseCompositeMovementFilters';
import { IStepCounter } from '../../shared/types/abstract-step-counter.interface';
import { Movement } from '../movement/Movement';
import { CHANCE_RATIO_MAP } from '../../shared/constants/chance-ratio-map.const';

export abstract class AbstractSequenceGenerator {
  private stepSequence: IMovementExtended[];
  private readonly library: MovementLibrary;
  private readonly context: StepContext<IMovementExtended>;
  private readonly counter: IStepCounter;
  private readonly randomGenerator: RouletteGenerator;
  private readonly tracker: StepTracker;
  private readonly filterStrategy: IGeneratorFilterStrategy<BaseCompositeMovementFilters>;

  constructor(
    library: MovementLibrary,
    context: StepContext<IMovementExtended>,
    counter: IStepCounter,
    randomGenerator: RouletteGenerator,
    tracker: StepTracker,
    filterStrategy: IGeneratorFilterStrategy<BaseCompositeMovementFilters>,
  ) {
    this.stepSequence = [];
    this.library = library;
    this.context = context;
    this.counter = counter;
    this.randomGenerator = randomGenerator;
    this.tracker = tracker;
    this.filterStrategy = filterStrategy;
  }

  abstract generate(amount: number): IMovementExtended[];

  protected abstract update(args: unknown[]): void;

  protected abstract reset(): void;

  private generateMovement(movements: Movement[]) {
    const movementIndex = this.randomGenerator.generateNumber(movements, CHANCE_RATIO_MAP);
    return movements[movementIndex];
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
}
