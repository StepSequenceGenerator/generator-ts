import { AbstractWeightCalculator } from './weight-calculator/AbstractWeightCalculator';
import { IRouletteGenerator } from '../../shared/types/roulette-generator.interface';
import { ChanceRatioMap } from '../../shared/types/movement-chance-ratio-map.type';
import { randomGenerator } from '../../utils/random-generator';

export abstract class AbstractRouletteGenerator<C, M> implements IRouletteGenerator<C, M> {
  protected abstract readonly fallbackWeight: number;
  protected weightCalc: AbstractWeightCalculator<C, M>;

  protected constructor(weightCalc: AbstractWeightCalculator<C, M>) {
    this.weightCalc = weightCalc;
  }

  public abstract generateNumber(selection: C[], chanceRatioMap: ChanceRatioMap<M>): number;

  protected getRandomIndex(max: number): number {
    const min = 0;
    return randomGenerator(min, max);
  }
}
