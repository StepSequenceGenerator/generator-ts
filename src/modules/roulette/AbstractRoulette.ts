import { IRouletteGenerator } from '../../shared/types/roulette-generator.interface';
import { ChanceRatioMap, WeightMapType } from '../../shared/types/chance-ratio-map.type';
import {
  IUniversalWeightCalculator,
  KeyExtractorType,
} from '../../shared/types/weight-calculator.interface';

/**
 * @param S первый дженерик для WeightCalculator
 * @param M второй дженерик для WeightCalculator
 * */
export abstract class AbstractRoulette<S, M> implements IRouletteGenerator<S, M> {
  protected readonly fallbackWeight = 0.1;
  protected weightCalc: IUniversalWeightCalculator;

  protected constructor(weightCalc: IUniversalWeightCalculator) {
    this.weightCalc = weightCalc;
  }

  public generateNumber(
    selection: S[],
    chanceRatioMap: ChanceRatioMap<M>,
    keyExtractor: KeyExtractorType<S, M>,
  ): number {
    const weightMap: WeightMapType<M> = this.weightCalc.count<S, M>({
      selection,
      chanceRatioMap,
      keyExtractor,
    });

    const weightList = this.createWeightList(selection, weightMap);
    const virtualChanceListLength = this.getVirtualChanceListLength(weightList);
    const randomIndex = this.getRandomIndex(virtualChanceListLength);

    return this.getItemIndex(weightList, randomIndex);
  }

  protected createWeightList(selection: S[], weights: WeightMapType<M>): number[] {
    return selection.map((item: S) => {
      const weightKey = this.getWeightKey(item);
      return weights.get(weightKey) ?? this.fallbackWeight;
    });
  }

  /**
   * Получения ключа для weightMap на случай, если в weightMap ключи сформированы не по имени в selection
   * Реализовать логику формирования ключа
   * @param item элемент из selection
   * @return возвращает ключ с типом второго дженерика в классе
   * */
  protected abstract getWeightKey(item: S): M;

  protected getVirtualChanceListLength(chanceList: number[]): number {
    return chanceList.reduce((acc: number, chance: number) => acc + chance, 0);
  }

  protected getRandomIndex(max: number): number {
    return Math.random() * max;
  }

  protected getItemIndex(chanceList: number[], randomIndex: number): number {
    let cumulative: number = 0;
    for (let i = 0; i < chanceList.length; i++) {
      cumulative += chanceList[i];
      if (cumulative >= randomIndex) return i;
    }
    return chanceList.length - 1;
  }
}
