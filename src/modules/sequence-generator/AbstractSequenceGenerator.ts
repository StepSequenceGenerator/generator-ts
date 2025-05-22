import { Movement } from '../movement/Movement';
import { MovementLibrary } from '../movement/MovementLibrary';
import { IMovementExtended } from '../../shared/types/extended-movement/movement-extended.interface';
import { MovementExtendedFactory } from '../movement/MovementExtendedFactory';
import { StepContext } from './StepContext';
import { MovementRouletteGenerator } from '../roulette/MovementRouletteGenerator';
import { StepTracker } from '../sequence-tracker/StepTracker';

import { randomGenerator } from '../../utils/random-generator';
import { MOVEMENTS_CHANCE_RATIO_MAP } from '../../shared/constants/chance-ratio-map.const';

import { DistanceFactorType } from '../../shared/types/distance-factor.type';
import { IStepCounter } from '../../shared/types/abstract-step-counter.interface';
import { ICoordinates } from '../../shared/types/extended-movement/movement-coordinates.interface';
import { MapMovementCompositeFilterType } from '../../shared/types/map-composite-filters.type';
import { FilterStrategyName } from '../../shared/enums/filter-stategy-name.enum';
import { BaseCompositeMovementFilters } from '../filter-strategy/BaseCompositeMovementFilters';

export abstract class AbstractSequenceGenerator<C extends IStepCounter> {
  protected stepSequence: IMovementExtended[];
  protected readonly library: MovementLibrary;
  protected readonly context: StepContext<IMovementExtended>;
  protected readonly counter: C;
  protected readonly randomGenerator: MovementRouletteGenerator;
  protected readonly tracker: StepTracker;
  protected readonly filterStrategy: MapMovementCompositeFilterType;

  protected constructor(data: {
    library: MovementLibrary;
    context: StepContext<IMovementExtended>;
    counter: C;
    randomGenerator: MovementRouletteGenerator;
    tracker: StepTracker;
    filterStrategy: MapMovementCompositeFilterType;
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

  abstract generate(...args: unknown[]): IMovementExtended[];

  protected generateMovement(
    distanceFactor: DistanceFactorType,
    filterStrategy: BaseCompositeMovementFilters,
  ): IMovementExtended {
    const currentLibrary = this.getCurrentLibrary(filterStrategy);
    const newMovement = this.chooseMovement(currentLibrary.movements);
    const extendedMovement = this.extendMovement(newMovement);
    extendedMovement.coordinates = this.getCoordinates(newMovement, distanceFactor);
    return extendedMovement;
  }

  protected extendMovement(movement: Movement): IMovementExtended {
    return MovementExtendedFactory.createMovementExtended({
      movement,
      coordinates: { coordinates: null },
      threeTurnsBlockInfo: { threeTurnsBlockInfo: null },
    });
  }

  protected chooseMovement(movements: Movement[]) {
    const movementIndex = this.randomGenerator.generateNumber(
      movements,
      MOVEMENTS_CHANCE_RATIO_MAP,
    );
    return movements[movementIndex];
  }

  protected getCurrentLibrary(filterStrategy: BaseCompositeMovementFilters): MovementLibrary {
    return filterStrategy.filter(this.library, this.context);
  }

  protected getFilterStrategy(
    filterStrategyName: FilterStrategyName,
  ): BaseCompositeMovementFilters {
    const strategy = this.filterStrategy.get(filterStrategyName);
    if (!strategy) throw new Error(`Filter strategy with name ${filterStrategyName} not found`);
    return strategy;
  }

  public reset(): void {
    this.resetSequence();
    this.counter.reset();
    this.context.resetCurrentStep();
  }

  protected resetSequence() {
    this.stepSequence = [];
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

  protected getCoordinates(
    newMovement: Movement,
    distanceFactor: DistanceFactorType,
  ): ICoordinates {
    const currentCoordinates = this.context.endCoordinate || this.tracker.getStartCoordinates();
    const vector = this.context.vector;

    const coordinates = this.tracker.getNextPosition(
      vector,
      currentCoordinates,
      newMovement.distance * distanceFactor,
    );

    return {
      vector: coordinates.vector,
      start: currentCoordinates,
      end: coordinates.coordinates,
    };
  }

  protected getRandomIndex(max: number) {
    const min = 0;
    return randomGenerator(min, max);
  }
}
