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
import { DistanceFactorType } from '../../shared/types/distance-factor.type';
import { SequenceTrackerError } from '../../errors/custom-errors';
import { ServiceMessageType } from '../../shared/types/service-message.type';

export class DefaultStepSequenceGenerator extends AbstractSequenceGenerator<StepCounter> {
  private threeTurnsBlockGenerator: ThreeTurnsBlockGenerator;
  private serviceMessage: ServiceMessageType;

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
    this.serviceMessage = {
      text: 'Генерация выполнена успешно',
      code: 'OK',
    };
  }

  generate(
    stepAmountBySequenceLevel: DifficultLevelAmountStep,
    distanceFactor: DistanceFactorType,
  ): IMovementExtended[] {
    this.reset();
    this.threeTurnsBlockGenerator.reset();

    try {
      while (this.counter.difficultTurnsOriginAmount < stepAmountBySequenceLevel) {
        if (this.isTimeToInsertThreeTurnsBlock()) {
          const movements = this.threeTurnsBlockGenerator.generate(
            this.context.currentStep || this.generateMovement(distanceFactor),
            distanceFactor,
          );
          movements.forEach((movement) => {
            this.update(movement);
          });
        } else {
          const movement = this.generateMovement(distanceFactor);
          this.update(movement);
        }
      }
    } catch (error: unknown) {
      if (error instanceof SequenceTrackerError) {
        this.serviceMessage = {
          text: 'Генерация прервана из-за внутренней ошибки',
          code: String(error.code),
        };
        console.debug('from DefaultStepSequenceGenerator', this.serviceMessage.code);
      }
    }

    return this.stepSequence;
  }

  private isTimeToInsertThreeTurnsBlock() {
    return this.threeTurnsBlockGenerator.blockAmount < 2 ? this.getRandomIndex(2) === 1 : false;
  }
}
