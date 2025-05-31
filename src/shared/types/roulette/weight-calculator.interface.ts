import { ChanceRatioMap, WeightMapType } from './chance-ratio-map.type';

export interface IWeightCalculator<S, M> {
  count(
    selection: S[],
    chanceRatioMap: ChanceRatioMap<M>,
    keyExtractor: (item: S) => M,
  ): WeightMapType<M>;
}

type CountArgsType<S, M> = {
  selection: S[];
  chanceRatioMap: ChanceRatioMap<M>;
  keyExtractor: (item: S) => M;
};

export interface IUniversalWeightCalculator {
  count<S, M>(args: CountArgsType<S, M>): WeightMapType<M>;
}

export type KeyExtractorType<S, M> = (item: S) => M;
