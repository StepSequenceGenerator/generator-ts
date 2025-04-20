import type { Movement } from '../movement/Movement.js';
import { WeightCalculatorBase } from './WeightCalculatorBase.js';

export class MovementWeightCalculator extends WeightCalculatorBase {
  public count(
    selection: Movement[],
    chanceRatioMap: Map<string, number>
  ): Map<string, number> {
    const groupMovementCounted = this.groupAndCountMovements(selection);
    const recalculatedChanceRatio = this.recalculateChanceRatio(
      Array.from(groupMovementCounted.keys()),
      chanceRatioMap
    );

    const itemsWeight = this.calcWeight(
      groupMovementCounted,
      recalculatedChanceRatio
    );
    return itemsWeight;
  }

  private recalculateChanceRatio(
    movementCharaterInUse: string[],
    chanceRatioMap: Map<string, number>
  ) {
    // 1. Разделение процента на использованный и неиспользованный
    const currentChanceRatioMap = new Map<string, number>();
    let unusedPercent = 0;
    let usedPercent = 0;

    const maxPercentOfChanceRatioMap = Math.max(...chanceRatioMap.values());

    for (const [key, percent] of chanceRatioMap.entries()) {
      if (movementCharaterInUse.includes(key)) {
        currentChanceRatioMap.set(key, percent);
        if (percent < maxPercentOfChanceRatioMap) usedPercent += percent;
      } else {
        unusedPercent += percent;
      }
    }

    // 2. Перераспределение "неиспользованного" процента
    const maxPercentCurrentChanceRatioMap = Math.max(
      ...currentChanceRatioMap.values()
    );
    const redistributionFactor =
      Math.round((unusedPercent / usedPercent) * 100) / 100;

    for (const [key, percent] of currentChanceRatioMap.entries()) {
      if (percent < maxPercentCurrentChanceRatioMap) {
        const adjusted = percent + percent * redistributionFactor;
        currentChanceRatioMap.set(key, adjusted);
      }
    }
    return currentChanceRatioMap;
  }

  private calcWeight(
    groupMovementCounted: Map<string, number>,
    recalculatedChanceRatio: Map<string, number>
  ): Map<string, number> {
    const totalItems = Array.from(groupMovementCounted.values()).reduce(
      (acc, cur) => acc + cur,
      0
    );
    const weightMap = new Map<string, number>();
    for (let [key, currentItemAmount] of groupMovementCounted.entries()) {
      const desirePercent = recalculatedChanceRatio.get(key) ?? 0;
      const desireItemAmount =
        Math.round((totalItems / 100) * desirePercent * 100) / 100;
      const weight =
        Math.round((desireItemAmount / currentItemAmount) * 100) / 100;
      weightMap.set(key, weight);
    }
    return weightMap;
  }
}
