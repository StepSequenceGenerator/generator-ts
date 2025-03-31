import { Movement } from './Movement.js';

class MovementLibrary {
  private readonly _movements: Movement[];

  constructor(movements: Movement[]) {
    this._movements = movements;
  }

  get movements() {
    return this._movements;
  }
}

export { MovementLibrary };
