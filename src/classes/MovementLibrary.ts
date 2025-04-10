import { Movement } from './Movement.js';
import {
  Edge,
  Leg,
  RotationDirection,
  TransitionDirection,
} from '../enums/movement-enums.js';

class MovementLibrary {
  private readonly _movements: Movement[];

  constructor(movements: Movement[]) {
    this._movements = movements;
  }

  filterByLeg(leg: Leg): MovementLibrary {
    return this.filterBy(
      (movement) => leg === Leg.BOTH || movement.startLeg === leg
    );
  }

  filterByEdge(edge: Edge): MovementLibrary {
    return this.filterBy(
      (movement) => edge === Edge.TWO_EDGES || movement.startEdge === edge
    );
  }

  filterByTransitionDirection(direction: TransitionDirection): MovementLibrary {
    return this.filterBy(
      (movement) =>
        direction === TransitionDirection.NONE ||
        movement.transitionDirection === direction
    );
  }

  filterByRotationDirection(direction: RotationDirection): MovementLibrary {
    return this.filterBy(
      (movement) => movement.rotationDirection === direction
    );
  }

  filterBy(fn: (movement: Movement) => boolean): MovementLibrary {
    return this.create(this._movements.filter(fn));
  }

  create(movement: Movement[]): MovementLibrary {
    return new MovementLibrary(movement);
  }

  get movements() {
    return this._movements;
  }
}

export { MovementLibrary };
