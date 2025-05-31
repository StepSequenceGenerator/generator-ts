import { ExtendedMovementCharacter } from '../../../shared/enums/movement-enums';
import { transformToExtendedMovementCharacterType } from '../../../utils/is-extended-movement-character';
import { Movement } from '../../movement/Movement';
import { VectorKey } from '../../../shared/enums/vector-key.enum';
import { ItemKeyExtractorType } from './WeightCalculator';

export const movementKeyExtractor: ItemKeyExtractorType<Movement, ExtendedMovementCharacter> = (
  item: Movement,
): ExtendedMovementCharacter =>
  item.isDifficult
    ? ExtendedMovementCharacter.DIFFICULT
    : transformToExtendedMovementCharacterType(item.type);

export const vectorKeyKeyExtractor: ItemKeyExtractorType<VectorKey, VectorKey> = (
  item: VectorKey,
): VectorKey => item;
