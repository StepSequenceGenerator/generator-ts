import { VectorKey } from '../../enums/vector-key.enum';
import { DescartesCoordinatesType } from '../descartes-coordinates.type';

interface ICoordinates {
  vector: VectorKey;
  start: DescartesCoordinatesType;
  end: DescartesCoordinatesType;
}

interface IMovementCoordinates {
  coordinates: ICoordinates | null;
}

export { IMovementCoordinates, ICoordinates };
