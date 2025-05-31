import { Movement } from '../../../movement/Movement';
import { ExtendedMovementCharacter } from '../../../../shared/enums/movement-enums';
import { WeightCalculator } from '../WeightCalculator';

export class DefaultMovementWeightCalculator extends WeightCalculator<
  Movement,
  ExtendedMovementCharacter
> {}
