import { MovementLibrary } from '../movement/MovementLibrary';
import { StepContext } from './StepContext';
import { StepCounter } from '../step-counter/StepCounter';
import { StepTracker } from '../sequence-tracker/StepTracker';
import { START_COORDINATES } from '../../shared/constants/start-coordinates';
import { VECTORS_TRACK } from '../../shared/constants/vectors-track';
import { VECTOR_ANGLES } from '../../shared/constants/vector-angles';
import { Movement } from '../movement/Movement';
import { GeneratorType } from '../../shared/enums/generator-type.enum';
import { DefaultStepSequenceGenerator } from './DefaultStepSequenceGenerator';
import { ThreeTurnsBlockGenerator } from './ThreeTurnsBlockGenerator';
import { ThreeDifficultTurnsBlockCounter } from '../step-counter/ThreeDifficultTurnsBlockCounter';
import { FilterCompositeMapFactory } from '../filter-strategy/FilterCompositeMapFactory';
import { FilterStrategyName } from '../../shared/enums/filter-stategy-name.enum';
import { VectorKeyChanceRatioMapGenerator } from '../chance-ratio-map-generator/VectorKeyChanceRatioMapGenerator';
import { CompassArc } from '../sequence-tracker/CompassArc';
import { WeightCalculator } from '../roulette/weight-calculator/WeightCalculator';
import { Roulette } from '../roulette/Roulette';
import { NumberGenerator } from '../roulette/number-generator/NumberGenerator';
import { MovementChanceRatioMapGenerator } from '../chance-ratio-map-generator/MovementChanceRatioMapGenerator';

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
    const roulette = new Roulette({
      weightCalc: new WeightCalculator(),
      numberGenerator: new NumberGenerator(),
    });

    return {
      library: new MovementLibrary(data),
      context: new StepContext(),
      chanceRatioMapGenerator: new MovementChanceRatioMapGenerator(),
      roulette,
      tracker: new StepTracker({
        standardStartCoordinates: START_COORDINATES,
        vectorsTrack: VECTORS_TRACK,
        vectorAngles: VECTOR_ANGLES,
        vectorKeyChanceRatioMapGenerator: new VectorKeyChanceRatioMapGenerator(),
        roulette,
      }),
      compassArc: new CompassArc(),
    };
  }

  protected static createDefaultConfig() {
    const filterStrategy = FilterCompositeMapFactory.createMap([
      FilterStrategyName.DEFAULT,
      FilterStrategyName.IS_CHANGE_LEG,
    ]);
    return {
      counter: new StepCounter(),
      filterStrategy: filterStrategy,
    };
  }

  protected static createThreeTurnsBlockConfig() {
    const filterStrategy = FilterCompositeMapFactory.createMap([
      FilterStrategyName.THREE_DIFFICULT_TURNS,
    ]);
    return {
      counter: new ThreeDifficultTurnsBlockCounter(),
      filterStrategy: filterStrategy,
    };
  }

  protected createMapCompositeFilters() {}
}
