import type { Movement } from '../movement/Movement.js';

export class MovementEqualWeightCalculator {
  public count(selection: Movement[]): Map<string, number> {
    const characterCounted = this.countEachCharacterAmount(selection);
    const maxAmount = this.getMaxAmount(characterCounted);
    return this.calcWeight(maxAmount, characterCounted);
  }

  private countEachCharacterAmount(selection: Movement[]) {
    const map = new Map<string, number>();
    for (let item of selection) {
      const key = item.isDifficult ? 'difficult' : item.type;
      const value = map.get(key) || 0;
      map.set(key, value + 1);
    }
    return map;
  }

  private getMaxAmount(map: Map<string, number>): number {
    return Math.max(...map.values());
  }

  private calcWeight(maxAmount: number, map: Map<string, number>) {
    const equalWeightMap = new Map<string, number>();

    for (const [key, amount] of map.entries()) {
      const weightToBeEqual = Math.round((maxAmount / amount) * 100) / 100;
      equalWeightMap.set(key, weightToBeEqual);
    }
    return equalWeightMap;
  }
}
