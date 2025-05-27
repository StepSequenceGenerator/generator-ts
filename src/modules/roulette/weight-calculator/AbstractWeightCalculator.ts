import { IWeightCalculator } from '../../../shared/types/weight-calculator.interface';
import { ChanceRatioMap, WeightMapType } from '../../../shared/types/chance-ratio-map.type';
import { round2 } from '../../../utils/round2';

type CalcItemWeightArgsType = {
  currentItemAmount: number;
  desirePercent: number;
  totalItems: number;
};

// todo сделать методы static
export abstract class AbstractWeightCalculator<S, M> implements IWeightCalculator<S, M> {
  abstract count(selection: S[], chanceRatioMap: ChanceRatioMap<M>): WeightMapType<M>;

  protected abstract calcWeights(...args: unknown[]): WeightMapType<M>;

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
}
