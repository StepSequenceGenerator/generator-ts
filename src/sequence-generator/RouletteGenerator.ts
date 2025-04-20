import { Movement } from '../movement/Movement.js';
import { randomInt } from 'node:crypto';
import { WeightCalculatorBase } from './WeightCalculatorBase.js';

export class RouletteGenerator {
  private weightCalc: WeightCalculatorBase;
  private readonly fallbackWeight = 0.1;

  constructor(weightCalc: WeightCalculatorBase) {
    this.weightCalc = weightCalc;
  }

  public generateNumber(
    selection: Movement[],
    chanceRatio: Map<string, number>
  ): number {
    const weightMap = this.weightCalc.count(selection, chanceRatio);

    // todo createWeightList отдает числа с большим количеством цифр после запятой. Найти и округлить
    const weightList = this.createWeightList(selection, weightMap);
    const virtualChanceListLength = this.getVirtualChanceListLength(weightList);
    const randomIndex = this.getRandomIndex(virtualChanceListLength);
    return this.getMovementIndex(weightList, randomIndex);
  }

  private createWeightList(
    selection: Movement[],
    weights: Map<string, number>
  ): number[] {
    return selection.map((item: Movement) => {
      const weightKey = item.isDifficult ? 'difficult' : item.type;
      return weights.get(weightKey) ?? this.fallbackWeight;
    });
  }

  private getVirtualChanceListLength(chanceList: number[]): number {
    return Math.floor(
      chanceList.reduce((acc: number, chance: number) => acc + chance, 0)
    );
  }

  private getMovementIndex(chanceList: number[], randomIndex: number): number {
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

  private getRandomIndex(max: number): number {
    if (max < 0) {
      throw new Error('from getRandomIndex: Not enough maximum number');
    }
    return randomInt(0, max);
  }
}
