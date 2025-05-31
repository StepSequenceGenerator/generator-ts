import { NumberGenerator, WeightKeyCreatorType } from './number-generator/NumberGenerator';
import { ItemKeyExtractorType, WeightCalculator } from './weight-calculator/WeightCalculator';
import { ChanceRatioMap } from '../../shared/types/chance-ratio-map.type';

export type RouletteConstructorArgsType = {
  weightCalc: WeightCalculator;
  numberGenerator: NumberGenerator;
};

export type SpinWheelArgsType<S, M> = {
  selection: S[];
  chanceRatioMap: ChanceRatioMap<M>;
  itemKeyExtractor: ItemKeyExtractorType<S, M>;
  weightKeyCreator: WeightKeyCreatorType<S, M>;
};

export class Roulette {
  private weightCalc: WeightCalculator;
  private numberGenerator: NumberGenerator;

  constructor(args: RouletteConstructorArgsType) {
    this.weightCalc = args.weightCalc;
    this.numberGenerator = args.numberGenerator;
  }

  /**
   * spinWheel
   * @arg args
   * @arg args.selection элементы
   * @arg args.chanceRatioMap шансы на выпадение элемента в selection в процентах
   * @arg args.itemKeyExtractor callback для опредления ключа для weightMap
   * @arg args.weightKeyCreator callback для опредления ключа в weightMap
   */
  public spinWheel<S, M>(args: SpinWheelArgsType<S, M>) {
    const { selection, chanceRatioMap, weightKeyCreator, itemKeyExtractor } = args;

    const weightMap = this.weightCalc.count<S, M>({
      selection,
      chanceRatioMap,
      itemKeyExtractor,
    });

    return this.numberGenerator.generateNumber<S, M>({
      selection,
      weightMap,
      weightKeyCreator,
    });
  }

  public setFallbackWeight(value: number): void {
    this.numberGenerator.fallbackWeight = value;
  }
}
