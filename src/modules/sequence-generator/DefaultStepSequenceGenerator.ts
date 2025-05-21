import { AbstractSequenceGenerator } from './AbstractSequenceGenerator';
import { MovementLibrary } from '../movement/MovementLibrary';
import { StepContext } from './StepContext';
import { IMovementExtended } from '../../shared/types/extended-movement/movement-extended.interface';
import { MovementRouletteGenerator } from '../roulette/MovementRouletteGenerator';
import { StepTracker } from '../sequence-tracker/StepTracker';
import { StepCounter } from '../step-counter/StepCounter';
import { DifficultLevelAmountStep } from '../../shared/enums/difficult-level-amount-step.enum';
import { ThreeTurnsBlockGenerator } from './ThreeTurnsBlockGenerator';
import { DistanceFactorType } from '../../shared/types/distance-factor.type';
import { SequenceTrackerError } from '../../errors/custom-errors';
import { ServiceMessageType } from '../../shared/types/service-message.type';
import { MapMovementCompositeFilterType } from '../../shared/types/map-composite-filters.type';
import { FilterStrategyName } from '../../shared/enums/filter-stategy-name.enum';

export class DefaultStepSequenceGenerator extends AbstractSequenceGenerator<StepCounter> {
  private threeTurnsBlockGenerator: ThreeTurnsBlockGenerator;
  private serviceMessage: ServiceMessageType;

  constructor(data: {
    library: MovementLibrary;
    context: StepContext<IMovementExtended>;
    counter: StepCounter;
    randomGenerator: MovementRouletteGenerator;
    tracker: StepTracker;
    filterStrategy: MapMovementCompositeFilterType;
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
            this.context.currentStep ||
              this.generateMovement(
                distanceFactor,
                this.getFilterStrategy(FilterStrategyName.DEFAULT),
              ),
            distanceFactor,
          );
          movements.forEach((movement) => {
            this.update(movement);
          });
        } else {
          const movement = this.generateMovement(
            distanceFactor,
            this.getFilterStrategy(FilterStrategyName.DEFAULT),
          );
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
