import type { Movement } from '../../movement/Movement';
import { BaseMovementWeightCalculator } from './BaseMovementWeightCalculator';
import { MovementWeightMapType } from '../../../shared/types/movement-chance-ratio-map.type';
import { ExtendedMovementCharacter } from '../../../shared/enums/movement-enums';

export class EqualizingMovementWeightCalculator extends BaseMovementWeightCalculator {
  public count(selection: Movement[]): MovementWeightMapType {
    const characterCounted = this.groupAndCountMovements(selection);
    const maxAmount = this.getMaxGroupSize(characterCounted);

    return this.calcWeight(maxAmount, characterCounted);
  }

  private getMaxGroupSize(map: Map<string, number>): number {
    const values = [...map.values()];
    if (values.length === 0) return 0;
    return Math.max(...values);
  }

  protected calcWeight(
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
