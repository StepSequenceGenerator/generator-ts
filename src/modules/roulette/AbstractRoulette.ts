import { AbstractWeightCalculator } from './weight-calculator/AbstractWeightCalculator';
import { IRouletteGenerator } from '../../shared/types/roulette-generator.interface';
import { ChanceRatioMap, WeightMapType } from '../../shared/types/chance-ratio-map.type';

/**
 * @param C первый дженерик для WeightCalculator
 * @param M второй дженерик для WeightCalculator
 * */
export abstract class AbstractRoulette<C, M> implements IRouletteGenerator<C, M> {
  protected readonly fallbackWeight = 0.1;
  protected weightCalc: AbstractWeightCalculator<C, M>;

  protected constructor(weightCalc: AbstractWeightCalculator<C, M>) {
    this.weightCalc = weightCalc;
  }

  public generateNumber(selection: C[], chanceRatioMap: ChanceRatioMap<M>): number {
    const weightMap: WeightMapType<M> = this.weightCalc.count(selection, chanceRatioMap);

    const weightList = this.createWeightList(selection, weightMap);
    // console.log('weightList: ', weightList);
    const virtualChanceListLength = this.getVirtualChanceListLength(weightList);
    // console.log('virtualChanceListLength ', virtualChanceListLength);
    const randomIndex = this.getRandomIndex(virtualChanceListLength);
    // console.log('randomIndex ', randomIndex);
    return this.getItemIndex(weightList, randomIndex);
  }

  protected createWeightList(selection: C[], weights: WeightMapType<M>): number[] {
    return selection.map((item: C) => {
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
  protected abstract getWeightKey(item: C): M;

  protected getVirtualChanceListLength(chanceList: number[]): number {
    const res = chanceList.reduce((acc: number, chance: number) => acc + chance, 0);
    // console.log('res: ', res);
    return res;
    // return Math.floor(chanceList.reduce((acc: number, chance: number) => acc + chance, 0));
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
