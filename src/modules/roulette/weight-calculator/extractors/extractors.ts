import { ExtendedMovementCharacter } from '../../../../shared/enums/movement-enums';
import { transformToExtendedMovementCharacterType } from '../../../../utils/is-extended-movement-character';
import { Movement } from '../../../movement/Movement';
import { VectorKey } from '../../../../shared/enums/vector-key.enum';

export const movementKeyExtractor = (item: Movement): ExtendedMovementCharacter =>
  item.isDifficult
    ? ExtendedMovementCharacter.DIFFICULT
    : transformToExtendedMovementCharacterType(item.type);

export const vectorKeyKeyExtractor = (item: VectorKey): VectorKey => item;
