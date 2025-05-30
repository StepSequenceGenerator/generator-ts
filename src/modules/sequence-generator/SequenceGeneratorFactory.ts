import { MovementLibrary } from '../movement/MovementLibrary';
import { StepContext } from './StepContext';
import { StepCounter } from '../step-counter/StepCounter';
import { DefaultMovementWeightCalculator } from '../roulette/weight-calculator/movement-weight-calc/DefaultMovementWeightCalculator';
import { MovementRoulette } from '../roulette/MovementRoulette';
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
import { VectorKeyWeightCalculator } from '../roulette/weight-calculator/vector-key-weight-calc/VectorKeyWeightCalculator';
import { VectorKeyRoulette } from '../roulette/VectorKeyRoulette';
import { CompassArc } from '../sequence-tracker/CompassArc';

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
    const weightCalc = new DefaultMovementWeightCalculator();
    const vectorKeyChanceRatioMapGenerator = new VectorKeyChanceRatioMapGenerator();
    const vectorKeyWeightCalculator = new VectorKeyWeightCalculator();
    const vectorKeyRouletteGenerator = new VectorKeyRoulette(vectorKeyWeightCalculator);

    return {
      library: new MovementLibrary(data),
      context: new StepContext(),
      movementRoulette: new MovementRoulette(weightCalc),
      tracker: new StepTracker({
        standardStartCoordinates: START_COORDINATES,
        vectorsTrack: VECTORS_TRACK,
        vectorAngles: VECTOR_ANGLES,
        vectorKeyChanceRatioMapGenerator,
        vectorKeyRoulette: vectorKeyRouletteGenerator,
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
