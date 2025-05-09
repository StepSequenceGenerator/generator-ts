import {
  IMovementCoordinates,
  IMovementExtended,
} from '../../shared/types/movement-extended.interface';
import { Movement } from './Movement';

class MovementExtendedFactory {
  static createMovementExtended(data: {
    movement: Movement;
    coordinates: IMovementCoordinates;
  }): IMovementExtended {
    const { movement, coordinates } = data;
    return {
      ...movement,
      ...coordinates,
    };
  }
}

export { MovementExtendedFactory };
