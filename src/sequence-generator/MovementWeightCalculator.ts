import { Movement } from '../movement/Movement.js';

type MovementCharacterCountType = Map<string, number>;

export class MovementWeightCalculator {
  movementCharacterCount: MovementCharacterCountType;
  constructor() {
    this.movementCharacterCount = this.intiSimple();
  }

  private intiSimple() {
    return new Map<string, number>();
  }

  public count(selection: Movement[]) {
    this.resetMovementCharacterCount();

    const characterCounted = this.countEachCharacterAmount(selection);
    const sorted = this.sortMap;
  }

  private countEachCharacterAmount(selection: Movement[]) {
    const map = new Map<string, number>();
    for (let item of selection) {
      const key = item.type;
      const value = map.get(key) || 0;
      map.set(key, value + 1);
    }
    return map;
  }

  private calcWeight() {}

  private sortMap(map: Map<string, number>): Map<string, number> {
    return new Map<string, number>(
      Array.from(map.entries()).sort(([, a], [, b]) => a - b)
    );
  }

  private resetMovementCharacterCount() {
    this.movementCharacterCount.clear();
  }
}
