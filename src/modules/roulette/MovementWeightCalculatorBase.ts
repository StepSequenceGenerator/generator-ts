import type { Movement } from '../movement/Movement.js';
import { ExtendedMovementCharacter } from '../../shared/enums/movement-enums.js';
import { AbstractWeightCalculator } from './AbstractWeightCalculator';
import {
  MovementChanceRatioMapType,
  MovementWeightMapType,
} from '../../shared/types/movement-chance-ratio-map.type';
import { transformToExtendedMovementCharacterType } from '../../utils/is-extended-movement-character';

export abstract class MovementWeightCalculatorBase extends AbstractWeightCalculator<
  Movement,
  ExtendedMovementCharacter
> {
  abstract count(
    selection: Movement[],
    chanceRatioMap: MovementChanceRatioMapType,
  ): MovementWeightMapType;

  protected abstract calcWeight(...args: unknown[]): MovementWeightMapType;

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
