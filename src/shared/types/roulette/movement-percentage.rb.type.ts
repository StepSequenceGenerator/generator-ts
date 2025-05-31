import { ExtendedMovementCharacter } from '../../enums/movement-enums';

type MovementAbstractPercentageType<S> = Map<S, number>;
type MovementDefaultPercentageType = MovementAbstractPercentageType<ExtendedMovementCharacter>;

export type { MovementAbstractPercentageType, MovementDefaultPercentageType };
