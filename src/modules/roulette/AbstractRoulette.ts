import { AbstractWeightCalculator } from './weight-calculator/AbstractWeightCalculator';
import { IRouletteGenerator } from '../../shared/types/roulette-generator.interface';
import { ChanceRatioMap, WeightMapType } from '../../shared/types/chance-ratio-map.type';
import { randomGenerator } from '../../utils/random-generator';

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
    const virtualChanceListLength = this.getVirtualChanceListLength(weightList);
    const randomIndex = this.getRandomIndex(virtualChanceListLength);
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
    return Math.floor(chanceList.reduce((acc: number, chance: number) => acc + chance, 0));
  }

  protected getRandomIndex(max: number): number {
    const min = 0;
    return randomGenerator(min, max);
  }

  protected getItemIndex(chanceList: number[], randomIndex: number): number {
    let elementIndex: number = 0;
    for (let i = 0; i < chanceList.length; i++) {
      randomIndex -= chanceList[i];
      if (randomIndex <= 0) {
        elementIndex = i;
        break;
      }
    }
    return elementIndex;
  }
}
