import type { Movement } from '../movement/Movement.js';

export abstract class WeightCalculatorBase {
  abstract count(
    selection: Movement[],
    ...args: unknown[]
  ): Map<string, number>;

  protected groupAndCountMovements(selection: Movement[]) {
    const map = new Map<string, number>();
    for (let item of selection) {
      const key = item.isDifficult ? 'difficult' : item.type;
      const value = map.get(key) || 0;
      map.set(key, value + 1);
    }

    return map;
  }
}
