import { Movement } from '../movement/Movement.js';
import { randomInt } from 'node:crypto';
import { WeightCalculatorBase } from './WeightCalculatorBase.js';
import { ChanceRatioMapType, WeightMapType } from '../../shared/types/chance-ratio-map-type.js';
import { ExtendedMovementCharacter } from '../../shared/enums/movement-enums.js';
import { isExtendedMovementCharacter } from '../../utils/is-extended-movement-character.js';
import { randomGenerator } from '../../utils/random-generator';

export class RouletteGenerator {
  private weightCalc: WeightCalculatorBase;
  private readonly fallbackWeight = 0.1;

  constructor(weightCalc: WeightCalculatorBase) {
    this.weightCalc = weightCalc;
  }

  public generateNumber(selection: Movement[], chanceRatio: ChanceRatioMapType): number {
    const weightMap: WeightMapType = this.weightCalc.count(selection, chanceRatio);

    // todo createWeightList отдает числа с большим количеством цифр после запятой. Найти и округлить
    const weightList = this.createWeightList(selection, weightMap);
    const virtualChanceListLength = this.getVirtualChanceListLength(weightList);
    const randomIndex = this.getRandomIndex(virtualChanceListLength);
    return this.getMovementIndex(weightList, randomIndex);
  }

  private createWeightList(selection: Movement[], weights: WeightMapType): number[] {
    return selection.map((item: Movement) => {
      const weightKey = this.getWeightKey(item);
      return weights.get(weightKey) ?? this.fallbackWeight;
    });
  }

  // todo написать тест
  private getWeightKey(movement: Movement): ExtendedMovementCharacter {
    return movement.isDifficult
      ? ExtendedMovementCharacter.DIFFICULT
      : isExtendedMovementCharacter(movement.type)
        ? (movement.type as unknown as ExtendedMovementCharacter)
        : ExtendedMovementCharacter.UNKNOWN;
  }

  private getVirtualChanceListLength(chanceList: number[]): number {
    return Math.floor(chanceList.reduce((acc: number, chance: number) => acc + chance, 0));
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
    const min = 0;
    return randomGenerator(min, max);
  }
}
