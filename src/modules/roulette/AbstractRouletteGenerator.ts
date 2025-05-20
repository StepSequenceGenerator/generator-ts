import { WeightCalculatorBase } from './WeightCalculatorBase';

export abstract class AbstractRouletteGenerator {
  protected weightCalc: WeightCalculatorBase;
  constructor(weightCalc: WeightCalculatorBase) {
    this.weightCalc = weightCalc;
  }
}
