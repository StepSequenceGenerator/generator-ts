import { ChanceRatioMap } from './chance-ratio-map.type';
import { KeyExtractorType } from './weight-calculator.interface';

export interface IRouletteGenerator<S, M> {
  generateNumber(
    selection: S[],
    chanceRatioMap: ChanceRatioMap<M>,
    keyExtractor: KeyExtractorType<S, M>,
  ): number;
}
