import { MovementChanceRatioMapType } from '../types/chance-ratio-map.type';
import { ExtendedMovementCharacter } from '../enums/movement-enums';

export const MOVEMENTS_BASE_CHANCE_RATIO_MAP: MovementChanceRatioMapType = new Map<
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
