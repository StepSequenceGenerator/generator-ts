import { ChanceRatioMap } from './movement-chance-ratio-map.type';

export interface IRouletteGenerator<S, M> {
  generateNumber(selection: S[], chanceRatioMap: ChanceRatioMap<M>): number;
}
