import { AbstractRoulette } from './AbstractRoulette';

import { Movement } from '../movement/Movement.js';
import { DefaultMovementWeightCalculator } from './weight-calculator/movement-weight-calc/DefaultMovementWeightCalculator';
import { isExtendedMovementCharacter } from '../../utils/is-extended-movement-character.js';

import { ExtendedMovementCharacter } from '../../shared/enums/movement-enums.js';

export class MovementRoulette extends AbstractRoulette<Movement, ExtendedMovementCharacter> {
  constructor(weightCalc: DefaultMovementWeightCalculator) {
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
