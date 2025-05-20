import { ChanceRatioMap, WeightMapType } from './movement-chance-ratio-map.type';

export interface IWeightCalculator<S, M> {
  count(selection: S[], chanceRatioMap: ChanceRatioMap<M>): WeightMapType<M>;
}
