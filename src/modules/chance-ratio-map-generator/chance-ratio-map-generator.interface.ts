import { ChanceRatioMap } from '../../shared/types/roulette/chance-ratio-map.type';

export interface IChanceRatioMapGenerator<T, M extends ChanceRatioMap<T>> {
  getChanceRatioMap(...args: unknown[]): M;
}
