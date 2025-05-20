import { AbstractMovementFilterStrategy } from './abstract/AbstractMovementFilterStrategy.js';
import { MovementLibrary } from '../movement/MovementLibrary.js';

export class DifficultTurnsFilterStrategy extends AbstractMovementFilterStrategy {
  filter(library: MovementLibrary) {
    return library.filterByDifficultTurns();
  }
}
