import type { Movement } from '../movement/Movement.js';
import { ExtendedMovementCharacter } from '../../shared/enums/movement-enums.js';
import { transformToExtendedMovementCharacterType } from '../../utils/is-extended-movement-character.js';

export abstract class WeightCalculatorBase {
  abstract count(
    selection: Movement[],
    ...args: unknown[]
  ): Map<ExtendedMovementCharacter, number>;

  protected groupAndCountMovements(selection: Movement[]) {
    const map = new Map<ExtendedMovementCharacter, number>();
    for (let item of selection) {
      const key = item.isDifficult
        ? ExtendedMovementCharacter.DIFFICULT
        : transformToExtendedMovementCharacterType(item.type);
      const value = map.get(key) || 0;
      map.set(key, value + 1);
    }

    return map;
  }
}
