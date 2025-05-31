import { AbstractRoulette } from './AbstractRoulette';

import { Movement } from '../movement/Movement.js';
import { isExtendedMovementCharacter } from '../../utils/is-extended-movement-character.js';

import { ExtendedMovementCharacter } from '../../shared/enums/movement-enums.js';
import { WeightCalculator } from './weight-calculator/WeightCalculator';

export class MovementRoulette extends AbstractRoulette<Movement, ExtendedMovementCharacter> {
  constructor(weightCalc: WeightCalculator) {
    super(weightCalc);
  }

  // todo написать тест
  protected getWeightKey(movement: Movement): ExtendedMovementCharacter {
    return movement.isDifficult
      ? ExtendedMovementCharacter.DIFFICULT
      : isExtendedMovementCharacter(movement.type)
        ? (movement.type as unknown as ExtendedMovementCharacter)
        : ExtendedMovementCharacter.UNKNOWN;
  }
}
