import { IWeightCalculator } from '../../../shared/types/weight-calculator.interface';
import { ChanceRatioMap, WeightMapType } from '../../../shared/types/chance-ratio-map.type';
import { round2 } from '../../../utils/round2';

type CalcItemWeightArgsType = {
  currentItemAmount: number;
  desirePercent: number;
  totalItems: number;
};

/**
 * @name AbstractWeightCalculator
 * @param S тип для selection
 * @param M тип для ChanceRatioMap
 *
 * */
export abstract class AbstractWeightCalculator<S, M> implements IWeightCalculator<S, M> {
  count(selection: S[], chanceRatioMap: ChanceRatioMap<M>): WeightMapType<M> {
    const groupItemCounted = this.groupAndCountItems(selection);
    return this.calcWeights(groupItemCounted, chanceRatioMap);
  }

  protected calcWeights(
    groupItemCounted: Map<M, number>,
    chanceRatioMap: WeightMapType<M>,
  ): WeightMapType<M> {
    const totalItems = Array.from(groupItemCounted.values()).reduce((acc, cur) => acc + cur, 0);
    const weightMap: WeightMapType<M> = new Map<M, number>();

    for (let [key, currentItemAmount] of groupItemCounted.entries()) {
      const desirePercent = chanceRatioMap.get(key) || 0;
      const weight = this.calcItemWeight({ currentItemAmount, desirePercent, totalItems });

      weightMap.set(key, weight);
    }

    return weightMap;
  }

  /**
   * Рассчитывает вес (количество), элемента, необходимый для достижения желаемого процента
   * @param args
   * @param {number} args.currentItemAmount количество элеметов текущего типа
   * @param {number} args.desirePercent желаемый процент
   * @param {number} args.totalItems общее количество элементов в selection
   * @return {number}
   * Необходимое количество элемента для достижения желаемого процента.
   * */
  protected calcItemWeight(args: CalcItemWeightArgsType): number {
    const { currentItemAmount, desirePercent, totalItems } = args;
    const desireItemAmount = this.calcDesireItemAmount(totalItems, desirePercent);
    return this.calcWeight(currentItemAmount, desireItemAmount);
  }

  protected calcDesireItemAmount(totalItems: number, desirePercent: number): number {
    const HUNDRED_PERCENT = 100;
    return round2((totalItems / HUNDRED_PERCENT) * desirePercent);
  }

  protected calcWeight(currentItemAmount: number, desireItemAmount: number): number {
    return round2(desireItemAmount / currentItemAmount);
  }

  protected groupAndCountItems(selection: S[]) {
    const map = new Map<M, number>();
    for (let item of selection) {
      const key = this.createChanceRatioKey(item);
      const value = map.get(key) || 0;
      map.set(key, value + 1);
    }

    return map;
  }

  protected abstract createChanceRatioKey(item: S): M;
}
