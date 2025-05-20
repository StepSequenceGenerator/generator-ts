import { IWeightCalculator } from '../../shared/types/weight-calculator.interface';
import { ChanceRatioMap, WeightMapType } from '../../shared/types/movement-chance-ratio-map.type';

export abstract class AbstractWeightCalculator<S, M> implements IWeightCalculator<S, M> {
  abstract count(selection: S, chanceRatioMap: ChanceRatioMap<M>): WeightMapType<M>;
  protected abstract calcWeight(...args: unknown[]): WeightMapType<M>;
}
