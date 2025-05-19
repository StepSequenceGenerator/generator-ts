import { MovementLibrary } from '../movement/MovementLibrary.js';
import { StepContext } from '../sequence-generator/StepContext.js';
import { AbstractMovementFilterStrategy } from './abstract/AbstractMovementFilterStrategy.js';
import { Edge, Leg, TransitionDirection } from '../../shared/enums/movement-enums.js';
import { IMovementExtended } from '../../shared/types/movement-extended.interface';

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
