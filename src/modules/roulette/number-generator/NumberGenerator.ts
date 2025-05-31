import { WeightMapType } from '../../../shared/types/roulette/chance-ratio-map.type';

export type WeightKeyCreatorType<S, M> = (arg: S) => M;
export type GenerateNumberArgsType<S, M> = {
  selection: S[];
  weightMap: WeightMapType<M>;
  weightKeyCreator: WeightKeyCreatorType<S, M>;
};

export class NumberGenerator {
  private _fallbackWeight = 0.1;

  get fallbackWeight(): number {
    return this._fallbackWeight;
  }

  public set fallbackWeight(value: number) {
    this._fallbackWeight = value;
  }

  /**
   * generateNumber
   * @arg args
   * @arg args.selection элементы
   * @arg args.weightMap список весов элементов
   * @arg args.weightKeyCreator callback для опредления ключа в weightMap
   */

  public generateNumber<S, M>(args: GenerateNumberArgsType<S, M>): number {
    const weightList = this.createWeightList<S, M>(args);
    const virtualChanceListLength = this.getVirtualChanceListLength(weightList);
    const randomIndex = this.getRandomIndex(virtualChanceListLength);

    return this.getItemIndex(weightList, randomIndex);
  }

  protected createWeightList<S, M>(args: GenerateNumberArgsType<S, M>): number[] {
    const { selection, weightMap, weightKeyCreator } = args;
    return selection.map((item: S) => {
      const weightKey = weightKeyCreator(item);
      return weightMap.get(weightKey) ?? this.fallbackWeight;
    });
  }

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
