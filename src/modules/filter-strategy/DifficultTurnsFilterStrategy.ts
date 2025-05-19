import { AbstractMovementFilterStrategy } from './abstract/AbstractMovementFilterStrategy.js';
import { MovementLibrary } from '../movement/MovementLibrary.js';
import { StepContext } from '../sequence-generator/StepContext';
import { IMovementExtended } from '../../shared/types/movement-extended.interface';

export class DifficultTurnsFilterStrategy extends AbstractMovementFilterStrategy {
  filter(library: MovementLibrary) {
    return library.filterDifficultTurns();
  }
}
