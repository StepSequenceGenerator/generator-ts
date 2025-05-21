import { AbstractSequenceGenerator } from './AbstractSequenceGenerator';
import { MovementLibrary } from '../movement/MovementLibrary';
import { StepContext } from './StepContext';
import { IMovementExtended } from '../../shared/types/extended-movement/movement-extended.interface';
import { MovementRouletteGenerator } from '../roulette/MovementRouletteGenerator';
import { StepTracker } from '../sequence-tracker/StepTracker';

import { ThreeDifficultTurnsBlockCounter } from '../step-counter/ThreeDifficultTurnsBlockCounter';
import { DistanceFactorType } from '../../shared/types/distance-factor.type';
import { MapMovementCompositeFilterType } from '../../shared/types/map-composite-filters.type';
import { FilterStrategyName } from '../../shared/enums/filter-stategy-name.enum';

const THREE_TURNS_BLOCK_LENGTH = 3;

export class ThreeTurnsBlockGenerator extends AbstractSequenceGenerator<ThreeDifficultTurnsBlockCounter> {
  constructor(data: {
    library: MovementLibrary;
    context: StepContext<IMovementExtended>;
    counter: ThreeDifficultTurnsBlockCounter;
    randomGenerator: MovementRouletteGenerator;
    tracker: StepTracker;
    filterStrategy: MapMovementCompositeFilterType;
  }) {
    super(data);
  }

  generate(movement: IMovementExtended, distanceFactor: DistanceFactorType): IMovementExtended[] {
    const COUNT_CORRECTION = 1;
    this.context.currentStep = movement;
    this.counter.resetTurns();
    this.resetSequence();

    for (let i = 0; i < THREE_TURNS_BLOCK_LENGTH; i++) {
      const newMovement = this.generateMovement(
        distanceFactor,
        this.getFilterStrategy(FilterStrategyName.THREE_DIFFICULT_TURNS),
      );
      newMovement.threeTurnsBlockInfo = {
        blockNumber: this.counter.amount + COUNT_CORRECTION,
        orderNumber: i + COUNT_CORRECTION,
      };
      this.update(newMovement);
    }
    this.counter.increaseAmount();
    return this.stepSequence;
  }

  public get blockAmount() {
    return this.counter.amount;
  }
}
