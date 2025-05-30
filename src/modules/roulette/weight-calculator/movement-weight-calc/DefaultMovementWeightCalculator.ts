import { Movement } from '../../../movement/Movement';
import { ExtendedMovementCharacter } from '../../../../shared/enums/movement-enums';
import { transformToExtendedMovementCharacterType } from '../../../../utils/is-extended-movement-character';
import { AbstractWeightCalculator } from '../AbstractWeightCalculator';

export class DefaultMovementWeightCalculator extends AbstractWeightCalculator<
  Movement,
  ExtendedMovementCharacter
> {
  protected createChanceRatioKey(item: Movement): ExtendedMovementCharacter {
    return item.isDifficult
      ? ExtendedMovementCharacter.DIFFICULT
      : transformToExtendedMovementCharacterType(item.type);
  }
}
