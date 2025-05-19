import { IMovement } from '../../modules/movement/Movement';
import { IMovementCoordinates } from './movement-coordinates.interface';
import { IThreeTurnsBlockInfo } from './three-turns-block.interface';

interface IMovementExtended extends IMovement, IMovementCoordinates, IThreeTurnsBlockInfo {}

export type { IMovementExtended };
