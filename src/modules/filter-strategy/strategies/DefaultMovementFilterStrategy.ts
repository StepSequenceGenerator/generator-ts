import { MovementLibrary } from '../../movement/MovementLibrary';
import { StepContext } from '../../sequence-generator/StepContext';
import { AbstractMovementFilterStrategy } from '../abstract/AbstractMovementFilterStrategy';
import { Edge, Leg, TransitionDirection } from '../../../shared/enums/movement-enums';
import { IMovementExtended } from '../../../shared/types/extended-movement/movement-extended.interface';

export class DefaultMovementFilterStrategy extends AbstractMovementFilterStrategy {
  public filter(
    library: MovementLibrary,
    context: StepContext<IMovementExtended>,
  ): MovementLibrary {
    const result = library
      .filterByEdge(this.withDefault(context.currentEdge, Edge.TWO_EDGES))
      .filterByLeg(this.withDefault(context.currentLeg, Leg.BOTH))
      .filterByTransitionDirection(
        this.withDefault(context.currentDirection, TransitionDirection.NONE),
      );
    return result;
  }
}
