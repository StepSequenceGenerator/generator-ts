import type { Movement } from '../movement/Movement.js';
import { WeightCalculatorBase } from './WeightCalculatorBase.js';

export class MovementEqualizingWeightCalculator extends WeightCalculatorBase {
  public count(selection: Movement[]): Map<string, number> {
    const characterCounted = this.groupAndCountMovements(selection);
    const maxAmount = this.getMaxGroupSize(characterCounted);

    const weight = this.calcEqualizingWeights(maxAmount, characterCounted);

    return weight;
  }

  private getMaxGroupSize(map: Map<string, number>): number {
    const values = [...map.values()];
    if (values.length === 0) return 0;
    return Math.max(...values);
  }

  private calcEqualizingWeights(maxAmount: number, map: Map<string, number>) {
    const equalWeightMap = new Map<string, number>();

    for (const [key, amount] of map.entries()) {
      const weightToBeEqual = Math.round((maxAmount / amount) * 100) / 100;
      equalWeightMap.set(key, weightToBeEqual);
    }

    return equalWeightMap;
  }
}
