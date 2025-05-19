import { AbstractSequenceGenerator } from './AbstractSequenceGenerator';
import { MovementLibrary } from '../movement/MovementLibrary';
import { StepContext } from './StepContext';
import { IMovementExtended } from '../../shared/types/extended-movement/movement-extended.interface';
import { RouletteGenerator } from '../roulette/RouletteGenerator';
import { StepTracker } from '../sequence-tracker/StepTracker';
import { BaseCompositeMovementFilters } from '../filter-strategy/BaseCompositeMovementFilters';
import { ThreeDifficultTurnsBlockCounter } from '../step-counter/ThreeDifficultTurnsBlockCounter';
import { DistanceFactorType } from '../../shared/types/distance-factor.type';

const THREE_TURNS_BLOCK_LENGTH = 3;

export class ThreeTurnsBlockGenerator extends AbstractSequenceGenerator<ThreeDifficultTurnsBlockCounter> {
  constructor(data: {
    library: MovementLibrary;
    context: StepContext<IMovementExtended>;
    counter: ThreeDifficultTurnsBlockCounter;
    randomGenerator: RouletteGenerator;
    tracker: StepTracker;
    filterStrategy: BaseCompositeMovementFilters;
  }) {
    super(data);
  }

  generate(movement: IMovementExtended, distanceFactor: DistanceFactorType): IMovementExtended[] {
    const COUNT_CORRECTION = 1;
    this.context.currentStep = movement;
    this.counter.resetTurns();
    this.resetSequence();

    for (let i = 0; i < THREE_TURNS_BLOCK_LENGTH; i++) {
      const newMovement = this.generateMovement(distanceFactor);
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
