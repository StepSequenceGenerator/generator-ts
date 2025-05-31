import { Movement } from '../movement/Movement';
import { MovementLibrary } from '../movement/MovementLibrary';
import { IMovementExtended } from '../../shared/types/extended-movement/movement-extended.interface';
import { MovementExtendedFactory } from '../movement/MovementExtendedFactory';
import { StepContext } from './StepContext';
import { MovementRoulette } from '../roulette/MovementRoulette';
import { StepTracker } from '../sequence-tracker/StepTracker';

import { randomGenerator } from '../../utils/random-generator';
import { MOVEMENTS_BASE_CHANCE_RATIO_MAP } from '../../shared/constants/movement_chance-ratio-map.const';

import { DistanceFactorType } from '../../shared/types/distance-factor.type';
import { IStepCounter } from '../../shared/types/abstract-step-counter.interface';
import { ICoordinates } from '../../shared/types/extended-movement/movement-coordinates.interface';
import { MapMovementCompositeFilterType } from '../../shared/types/map-composite-filters.type';
import { FilterStrategyName } from '../../shared/enums/filter-stategy-name.enum';
import { BaseCompositeMovementFilters } from '../filter-strategy/BaseCompositeMovementFilters';
import { CompassArc } from '../sequence-tracker/CompassArc';
import { movementKeyExtractor } from '../roulette/weight-calculator/extractors/extractors';

export abstract class AbstractSequenceGenerator<C extends IStepCounter> {
  protected stepSequence: IMovementExtended[];
  protected readonly library: MovementLibrary;
  protected readonly context: StepContext<IMovementExtended>;
  protected readonly counter: C;
  protected readonly movementRoulette: MovementRoulette;
  protected readonly tracker: StepTracker;
  protected readonly filterStrategy: MapMovementCompositeFilterType;
  protected readonly compassArc: CompassArc;

  protected constructor(data: {
    library: MovementLibrary;
    context: StepContext<IMovementExtended>;
    counter: C;
    movementRoulette: MovementRoulette;
    tracker: StepTracker;
    filterStrategy: MapMovementCompositeFilterType;
    compassArc: CompassArc;
  }) {
    const { library, context, counter, movementRoulette, tracker, filterStrategy, compassArc } =
      data;
    this.stepSequence = [];
    this.library = library;
    this.context = context;
    this.counter = counter;
    this.movementRoulette = movementRoulette;
    this.tracker = tracker;
    this.filterStrategy = filterStrategy;
    this.compassArc = compassArc;
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
    const movementIndex = this.movementRoulette.generateNumber(
      movements,
      MOVEMENTS_BASE_CHANCE_RATIO_MAP,
      movementKeyExtractor,
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
    const currentAcrVectorIndex = this.compassArc.getArcVectorIndex({
      transitionDirection: this.context.currentDirection,
      leg: this.context.currentLeg,
      edge: this.context.currentEdge,
    });

    const coordinates = this.tracker.getNextPosition({
      currentVectorKey: vector,
      currentCoordinates,
      distance: newMovement.distance * distanceFactor,
      currentAcrVectorIndex,
    });

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
