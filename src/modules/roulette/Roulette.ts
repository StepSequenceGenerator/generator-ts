import { NumberGenerator, WeightKeyCreatorType } from './number-generator/NumberGenerator';
import { KeyExtractorType, WeightCalculator } from './weight-calculator/WeightCalculator';
import { ChanceRatioMap } from '../../shared/types/chance-ratio-map.type';

export type RouletteConstructorArgsType = {
  weightCalc: WeightCalculator;
  numberGenerator: NumberGenerator;
};

export type SpinWheelArgsType<S, M> = {
  selection: S[];
  chanceRatioMap: ChanceRatioMap<M>;
  keyExtractor: KeyExtractorType<S, M>;
  weightKeyCreator: WeightKeyCreatorType<S, M>;
};

export class Roulette {
  weightCalc: WeightCalculator;
  numberGenerator: NumberGenerator;

  constructor(args: RouletteConstructorArgsType) {
    this.weightCalc = args.weightCalc;
    this.numberGenerator = args.numberGenerator;
  }

  public spinWheel<S, M>(args: SpinWheelArgsType<S, M>) {
    const { selection, chanceRatioMap, weightKeyCreator, keyExtractor } = args;

    const weightMap = this.weightCalc.count<S, M>({
      selection,
      chanceRatioMap,
      keyExtractor,
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
