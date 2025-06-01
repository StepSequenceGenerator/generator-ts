import {
  ChanceRatioMap,
  WeightMapType,
} from '../../../shared/types/roulette/chance-ratio-map.type';
import { round2 } from '../../../utils/round2';

type CalcItemWeightArgsType = {
  currentItemAmount: number;
  desirePercent: number;
  totalItems: number;
};

export type ItemKeyExtractorType<S, M> = (item: S) => M;

type CountArgsType<S, M> = {
  selection: S[];
  chanceRatioMap: ChanceRatioMap<M>;
  itemKeyExtractor: ItemKeyExtractorType<S, M>;
};

/**
 * @name WeightCalculator
 * @param S тип для selection
 * @param M тип для ChanceRatioMap
 *
 * */
export class WeightCalculator {
  /**
   * count
   * @param args
   * @arg args.selection элементы
   * @arg args.chanceRatioMap шансы на выпадение элемента в selection в процентах
   * @arg args.itemKeyExtractor callback для опредления ключа для weightMap
   */
  public count<S, M>(args: CountArgsType<S, M>): WeightMapType<M> {
    const { selection, itemKeyExtractor, chanceRatioMap } = args;
    const groupItemCounted = this.groupAndCountItems<S, M>(selection, itemKeyExtractor);
    return this.calcWeights<M>(groupItemCounted, chanceRatioMap);
  }

  protected calcWeights<M>(
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

  protected groupAndCountItems<S, M>(selection: S[], keyExtractor: (item: S) => M) {
    const map = new Map<M, number>();
    for (let item of selection) {
      const key = keyExtractor(item);
      const value = map.get(key) || 0;
      map.set(key, value + 1);
    }

    return map;
  }
}
