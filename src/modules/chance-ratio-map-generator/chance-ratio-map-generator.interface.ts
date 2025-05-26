import { ChanceRatioMap } from '../../shared/types/movement-chance-ratio-map.type';

export interface IChanceRatioMapGenerator<T, M extends ChanceRatioMap<T>> {
  getChanceRatioMap(...args: unknown[]): M;
}
