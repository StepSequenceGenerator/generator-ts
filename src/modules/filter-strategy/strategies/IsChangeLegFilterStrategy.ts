import { AbstractMovementFilterStrategy } from '../abstract/AbstractMovementFilterStrategy';
import { MovementLibrary } from '../../movement/MovementLibrary';

export class IsChangeLegFilterStrategy extends AbstractMovementFilterStrategy {
  filter(library: MovementLibrary) {
    return library.filterByIsChangeLeg();
  }
}
