import { IMovement } from '../../modules/movement/Movement';
import { CoordinatesType } from './coordinates-type';
import { VectorKey } from '../enums/vector-key-enum';

interface ICoordinates {
  vector: VectorKey;
  start: CoordinatesType;
  end: CoordinatesType;
}

interface IMovementCoordinates {
  coordinates: ICoordinates;
}

interface IMovementExtended extends IMovement, IMovementCoordinates {}

export type { IMovementCoordinates, IMovementExtended, ICoordinates };
