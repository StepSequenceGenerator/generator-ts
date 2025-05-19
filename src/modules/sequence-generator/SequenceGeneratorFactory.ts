import { MovementLibrary } from '../movement/MovementLibrary';
import { StepContext } from './StepContext';
import { StepCounter } from '../step-counter/StepCounter';
import { MovementWeightCalculator } from '../roulette/MovementWeightCalculator';
import { RouletteGenerator } from '../roulette/RouletteGenerator';
import { StepTracker } from '../sequence-tracker/StepTracker';
import { START_COORDINATES } from '../../shared/constants/start-coordinates';
import { VECTORS_TRACK } from '../../shared/constants/vectors-track';
import { VECTOR_ANGLES } from '../../shared/constants/vector-angles';
import { Movement } from '../movement/Movement';
import { GeneratorType } from '../../shared/enums/generator-type.enum';
import { DefaultStepSequenceGenerator } from './DefaultStepSequenceGenerator';
import { ThreeTurnsBlockGenerator } from './ThreeTurnsBlockGenerator';
import { DifficultTurnsFilterStrategy } from '../filter-strategy/DifficultTurnsFilterStrategy';
import { GeneratorFilterStrategyFactory } from '../filter-strategy/BaseCompositeMovementFilters';
import { DefaultMovementFilterStrategy } from '../filter-strategy/DefaultMovementFilterStrategy';
import { ThreeDifficultTurnsBlockCounter } from '../step-counter/ThreeDifficultTurnsBlockCounter';

export class SequenceGeneratorFactory {
  private static generator = new Map<GeneratorType, unknown>([
    [GeneratorType.DEFAULT, DefaultStepSequenceGenerator],
    [GeneratorType.THREE_TURNS_BLOCK, ThreeTurnsBlockGenerator],
  ]);

  static create(type: GeneratorType, data: Movement[]) {
    switch (type) {
      case GeneratorType.DEFAULT:
        return this.createDefaultGenerator(data);
      case GeneratorType.THREE_TURNS_BLOCK:
        return this.createThreeTurnsBlockGenerator(data);
      default:
        throw new Error(`Unsupported generator type ${type}`);
    }
  }

  static createDefaultGenerator(data: Movement[]) {
    return new DefaultStepSequenceGenerator({
      ...this.createBaseConfig(data),
      ...this.createDefaultConfig(),
      threeTurnsBlockGenerator: this.createThreeTurnsBlockGenerator(data),
    });
  }

  private static createThreeTurnsBlockGenerator(data: Movement[]) {
    return new ThreeTurnsBlockGenerator({
      ...this.createBaseConfig(data),
      ...this.createThreeTurnsBlockConfig(),
    });
  }

  protected static createBaseConfig(data: Movement[]) {
    const weightCalc = new MovementWeightCalculator();
    return {
      library: new MovementLibrary(data),
      context: new StepContext(),
      randomGenerator: new RouletteGenerator(weightCalc),
      tracker: new StepTracker(START_COORDINATES, VECTORS_TRACK, VECTOR_ANGLES),
    };
  }

  protected static createDefaultConfig() {
    const defaultFilterStrategy = new DefaultMovementFilterStrategy();
    const filterComposite = GeneratorFilterStrategyFactory.create([defaultFilterStrategy]);
    return {
      counter: new StepCounter(),
      filterStrategy: filterComposite,
    };
  }

  protected static createThreeTurnsBlockConfig() {
    const defaultFilterStrategy = new DefaultMovementFilterStrategy();
    const difficultTurnsFilterStrategy = new DifficultTurnsFilterStrategy();
    const filterComposite = GeneratorFilterStrategyFactory.create([
      defaultFilterStrategy,
      difficultTurnsFilterStrategy,
    ]);
    return {
      counter: new ThreeDifficultTurnsBlockCounter(),
      filterStrategy: filterComposite,
    };
  }
}
