import type { Movement } from '../movement/Movement.js';
import { WeightCalculatorBase } from './WeightCalculatorBase.js';
import { MovementWeightMapType } from '../../shared/types/movement-chance-ratio-map.type';
import { ExtendedMovementCharacter } from '../../shared/enums/movement-enums.js';

export class MovementEqualizingWeightCalculator extends WeightCalculatorBase {
  public count(selection: Movement[]): MovementWeightMapType {
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

  private calcEqualizingWeights(
    maxAmount: number,
    map: Map<ExtendedMovementCharacter, number>,
  ): MovementWeightMapType {
    const equalWeightMap = new Map<ExtendedMovementCharacter, number>();

    for (const [key, amount] of map.entries()) {
      const weightToBeEqual = Math.round((maxAmount / amount) * 100) / 100;
      equalWeightMap.set(key, weightToBeEqual);
    }

    return equalWeightMap;
  }
}
