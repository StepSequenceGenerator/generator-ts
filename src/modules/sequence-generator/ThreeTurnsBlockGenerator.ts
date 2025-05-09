import { AbstractSequenceGenerator } from './AbstractSequenceGenerator';
import { MovementLibrary } from '../movement/MovementLibrary';
import { StepContext } from './StepContext';
import { IMovementExtended } from '../../shared/types/movement-extended.interface';
import { RouletteGenerator } from '../roulette/RouletteGenerator';
import { StepTracker } from '../sequence-tracker/StepTracker';
import {
  BaseCompositeMovementFilters,
  IGeneratorFilterStrategy,
} from '../filter-strategy/BaseCompositeMovementFilters';
import { ThreeDifficultTurnsBlockCounter } from './ThreeDifficultTurnsBlockCounter';

const THREE_TURNS_BLOCK_LENGTH = 3;

export class ThreeTurnsBlockGenerator extends AbstractSequenceGenerator<ThreeDifficultTurnsBlockCounter> {
  constructor(
    library: MovementLibrary,
    context: StepContext<IMovementExtended>,
    counter: ThreeDifficultTurnsBlockCounter,
    randomGenerator: RouletteGenerator,
    tracker: StepTracker,
    filterStrategy: IGeneratorFilterStrategy<BaseCompositeMovementFilters>,
  ) {
    super(library, context, counter, randomGenerator, tracker, filterStrategy);
  }

  generate(movement: IMovementExtended): IMovementExtended[] {
    this.context.currentStep = movement;
    this.counter.resetTurns();

    for (let i = 0; i < THREE_TURNS_BLOCK_LENGTH; i++) {
      const newMovement = this.generateMovement();
      this.update(newMovement);
    }
    this.counter.increaseAmount();
    return this.stepSequence;
  }

  counterUpdate(movementExtended: IMovementExtended): void {
    this.counter.update(movementExtended);
  }
}
