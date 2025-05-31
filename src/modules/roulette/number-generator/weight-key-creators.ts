import { ExtendedMovementCharacter } from '../../../shared/enums/movement-enums';
import { isExtendedMovementCharacter } from '../../../utils/is-extended-movement-character';
import { Movement } from '../../movement/Movement';
import { VectorKey } from '../../../shared/enums/vector-key.enum';
import { WeightKeyCreatorType } from './NumberGenerator';

export const movementWeightKeyCreator: WeightKeyCreatorType<Movement, ExtendedMovementCharacter> = (
  movement: Movement,
) => {
  return movement.isDifficult
    ? ExtendedMovementCharacter.DIFFICULT
    : isExtendedMovementCharacter(movement.type)
      ? (movement.type as unknown as ExtendedMovementCharacter)
      : ExtendedMovementCharacter.UNKNOWN;
};

export const vectorWeightKeyCreator: WeightKeyCreatorType<VectorKey, VectorKey> = (
  vectorKey: VectorKey,
) => vectorKey;
