import { AbstractSequenceGenerator } from './AbstractSequenceGenerator';
import { MovementLibrary } from '../movement/MovementLibrary';
import { StepContext } from './StepContext';
import { IMovementExtended } from '../../shared/types/movement-extended.interface';
import { RouletteGenerator } from '../roulette/RouletteGenerator';
import { StepTracker } from '../sequence-tracker/StepTracker';
import { BaseCompositeMovementFilters } from '../filter-strategy/BaseCompositeMovementFilters';
import { StepCounter } from './StepCounter';
import { DifficultLevelAmountStep } from '../../shared/enums/difficult-level-amount-step-enum';
import { ThreeTurnsBlockGenerator } from './ThreeTurnsBlockGenerator';

export class DefaultStepSequenceGenerator extends AbstractSequenceGenerator<StepCounter> {
  threeTurnsBlockGenerator: ThreeTurnsBlockGenerator;

  constructor(data: {
    library: MovementLibrary;
    context: StepContext<IMovementExtended>;
    counter: StepCounter;
    randomGenerator: RouletteGenerator;
    tracker: StepTracker;
    filterStrategy: BaseCompositeMovementFilters;
    threeTurnsBlockGenerator: ThreeTurnsBlockGenerator;
  }) {
    const {
      library,
      context,
      counter,
      randomGenerator,
      tracker,
      filterStrategy,
      threeTurnsBlockGenerator,
    } = data;
    super({ library, context, counter, randomGenerator, tracker, filterStrategy });
    this.threeTurnsBlockGenerator = threeTurnsBlockGenerator;
  }

  generate(stepAmountBySequenceLevel: DifficultLevelAmountStep): IMovementExtended[] {
    this.reset();
    this.threeTurnsBlockGenerator.reset();

    while (this.counter.difficultTurnsOriginAmount < stepAmountBySequenceLevel) {
      if (this.isTimeToInsertThreeTurnsBlock()) {
        const movements = this.threeTurnsBlockGenerator.generate(
          this.context.currentStep || this.generateMovement(),
        );
        movements.forEach((movement) => {
          this.update(movement);
        });
      } else {
        const movement = this.generateMovement();
        this.update(movement);
      }
    }
    return this.stepSequence;
  }

  private isTimeToInsertThreeTurnsBlock() {
    return this.threeTurnsBlockGenerator.blockAmount < 2 ? this.getRandomIndex(2) === 1 : false;
  }
}
