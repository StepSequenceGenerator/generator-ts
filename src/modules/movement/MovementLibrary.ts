import { Movement } from './Movement.js';
import {
  Edge,
  Leg,
  MovementCharacter,
  RotationDirection,
  TransitionDirection,
} from '../../enums/movement-enums.js';

class MovementLibrary {
  private readonly _movements: Movement[];

  constructor(movements: Movement[]) {
    this._movements = movements;
  }

  filterByLeg(leg: Leg): MovementLibrary {
    return this.filterBy(
      (movement) =>
        leg === Leg.BOTH ||
        movement.startLeg === leg ||
        movement.startLeg === Leg.BOTH
    );
  }

  filterByEdge(edge: Edge): MovementLibrary {
    return this.filterBy((movement) => {
      return (
        edge === Edge.TWO_EDGES ||
        movement.startEdge === edge ||
        movement.startEdge === Edge.TWO_EDGES
      );
    });
  }

  filterByTransitionDirection(direction: TransitionDirection): MovementLibrary {
    return this.filterBy(
      (movement) =>
        direction === TransitionDirection.NONE ||
        movement.transitionDirection === direction ||
        movement.transitionDirection === TransitionDirection.NONE
    );
  }

  filterByRotationDirection(direction: RotationDirection): MovementLibrary {
    return this.filterBy(
      (movement) =>
        direction === RotationDirection.NONE ||
        movement.rotationDirection === direction ||
        movement.rotationDirection === RotationDirection.NONE
    );
  }

  filterDifficultTurns() {
    return this.filterBy(
      (movement) =>
        movement.isDifficult && movement.type === MovementCharacter.TURN
    );
  }

  filterBy(fn: (movement: Movement) => boolean): MovementLibrary {
    return this.create(this.movements.filter(fn));
  }

  create(movement: Movement[]): MovementLibrary {
    return new MovementLibrary(movement);
  }

  get movements() {
    return this._movements;
  }
}

export { MovementLibrary };
