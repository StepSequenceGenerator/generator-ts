import { AbstractMovementFilterStrategy } from './abstract/AbstractMovementFilterStrategy.js';
import { MovementLibrary } from '../movement/MovementLibrary.js';
import { StepContext } from '../sequence-generator/StepContext.js';

export class DifficultTurnsFilterStrategy extends AbstractMovementFilterStrategy {
  filter(library: MovementLibrary, context: StepContext) {
    return library.filterDifficultTurns();
  }
}
