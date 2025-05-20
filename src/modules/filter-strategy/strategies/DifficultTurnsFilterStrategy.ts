import { AbstractMovementFilterStrategy } from '../abstract/AbstractMovementFilterStrategy';
import { MovementLibrary } from '../../movement/MovementLibrary';

export class DifficultTurnsFilterStrategy extends AbstractMovementFilterStrategy {
  filter(library: MovementLibrary) {
    return library.filterByDifficultTurns();
  }
}
