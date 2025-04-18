import { Movement } from '../movement/Movement.js';
import { randomInt } from 'node:crypto';

export class RouletteGenerator {
  public generateNumber(selection: Movement[], chance: number): number {
    const chanceList = this.createChanceList(selection, chance);
    const virtualChanceListLength = this.getVirtualChanceListLength(chanceList);
    const randomIndex = this.getRandomIndex(virtualChanceListLength);
    const movementIndex = this.getMovementIndex(chanceList, randomIndex);
    return movementIndex;
  }

  private createChanceList(selection: Movement[], chance: number): number[] {
    return selection.map((item: Movement) => (item.isDifficult ? chance : 1));
  }

  private getVirtualChanceListLength(chanceList: number[]): number {
    return chanceList.reduce((acc: number, chance: number) => acc + chance, 0);
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
