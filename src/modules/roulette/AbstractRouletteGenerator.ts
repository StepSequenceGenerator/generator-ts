import { AbstractWeightCalculator } from './AbstractWeightCalculator';

export abstract class AbstractRouletteGenerator<C, M> {
  protected weightCalc: AbstractWeightCalculator<C, M>;
  constructor(weightCalc: AbstractWeightCalculator<C, M>) {
    this.weightCalc = weightCalc;
  }
}
