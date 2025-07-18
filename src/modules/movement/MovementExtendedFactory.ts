import { Movement } from './Movement';
import { IThreeTurnsBlockInfo } from '../../shared/types/extended-movement/three-turns-block.interface';
import { IMovementExtended } from '../../shared/types/extended-movement/movement-extended.interface';
import { IMovementCoordinates } from '../../shared/types/extended-movement/movement-coordinates.interface';

class MovementExtendedFactory {
  static createMovementExtended(data: {
    movement: Movement;
    coordinates: IMovementCoordinates;
    threeTurnsBlockInfo: IThreeTurnsBlockInfo;
  }): IMovementExtended {
    const { movement, coordinates, threeTurnsBlockInfo } = data;
    return {
      ...movement,
      ...coordinates,
      ...threeTurnsBlockInfo,
    };
  }
}

export { MovementExtendedFactory };
