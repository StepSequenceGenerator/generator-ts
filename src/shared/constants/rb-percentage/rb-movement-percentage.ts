import { ExtendedMovementCharacter } from '../../enums/movement-enums';
import { MovementDefaultPercentageType } from '../../types/roulette/movement-percentage.rb.type';

export const RB_MOVEMENTS_PERCENTAGE: MovementDefaultPercentageType = new Map<
  ExtendedMovementCharacter,
  number
>([
  [ExtendedMovementCharacter.STEP, 8],
  [ExtendedMovementCharacter.TURN, 9],
  [ExtendedMovementCharacter.SEQUENCE, 9],
  [ExtendedMovementCharacter.HOP, 8],
  [ExtendedMovementCharacter.GLIDE, 8],
  [ExtendedMovementCharacter.UNKNOWN, 8],
  [ExtendedMovementCharacter.DIFFICULT, 50],
]);
