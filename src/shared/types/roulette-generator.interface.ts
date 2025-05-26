import { ChanceRatioMap } from './chance-ratio-map.type';

export interface IRouletteGenerator<S, M> {
  generateNumber(selection: S[], chanceRatioMap: ChanceRatioMap<M>): number;
}
