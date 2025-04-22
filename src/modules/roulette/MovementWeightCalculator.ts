import type { Movement } from '../movement/Movement.js';
import { WeightCalculatorBase } from './WeightCalculatorBase.js';
import {
  ChanceRatioMapType,
  WeightMapType,
} from '../../shared/types/chance-ratio-map-type.js';
import { round2 } from '../../utils/round2.js';
import { ExtendedMovementCharacter } from '../../enums/movement-enums.js';
import { transformToExtendedMovementCharacterType } from '../../utils/is-extended-movement-character.js';

export class MovementWeightCalculator extends WeightCalculatorBase {
  public count(
    selection: Movement[],
    chanceRatioMap: ChanceRatioMapType
  ): WeightMapType {
    const groupMovementCounted = this.groupAndCountMovements(selection);
    const recalculatedChanceRatio = this.recalculateChanceRatio(
      Array.from(groupMovementCounted.keys()),
      chanceRatioMap
    );

    return this.calcWeight(groupMovementCounted, recalculatedChanceRatio);
  }

  private recalculateChanceRatio(
    movementCharacterInUse: string[],
    chanceRatioMap: ChanceRatioMapType
  ) {
    const actualChanceRatioMap: ChanceRatioMapType =
      this.getActualChanceRatioMap(movementCharacterInUse, chanceRatioMap);

    const percentSeparated = this.separatePercentByType(actualChanceRatioMap);

    return this.redistributeChanceRatio(percentSeparated, actualChanceRatioMap);
  }

  private redistributeChanceRatio(
    percentSeparated: { unusedPercent: number; usedPercent: number },
    actualChanceRatioMap: Map<string, number>
  ): ChanceRatioMapType {
    const map: ChanceRatioMapType = new Map<
      ExtendedMovementCharacter,
      number
    >();
    const { unusedPercent, usedPercent } = percentSeparated;
    const maxPercentCurrentChanceRatioMap = Math.max(
      ...actualChanceRatioMap.values()
    );
    const redistributionFactor =
      usedPercent === 0 ? 0 : round2(unusedPercent / usedPercent);

    for (const [key, percent] of actualChanceRatioMap.entries()) {
      const typedKey = transformToExtendedMovementCharacterType(key);
      if (percent < maxPercentCurrentChanceRatioMap) {
        const adjusted = percent + percent * redistributionFactor;
        map.set(typedKey, adjusted);
      } else {
        map.set(typedKey, percent);
      }
    }

    return map;
  }

  private getActualChanceRatioMap(
    charactersInUse: string[],
    chanceRatioMap: ChanceRatioMapType
  ): ChanceRatioMapType {
    const map = new Map<ExtendedMovementCharacter, number>();
    for (const [key, percent] of chanceRatioMap.entries()) {
      if (charactersInUse.includes(key)) {
        map.set(key, percent);
      }
    }
    return map;
  }

  private separatePercentByType(actualChanceRatioMap: ChanceRatioMapType): {
    unusedPercent: number;
    usedPercent: number;
  } {
    const HUNDRED_PERCENTAGE = 100;

    const maxPercentOfChanceRatioMap = Math.max(
      ...actualChanceRatioMap.values()
    );
    const usedPercent =
      Array.from(actualChanceRatioMap.values()).reduce(
        (acc, cur) => acc + cur,
        0
      ) - maxPercentOfChanceRatioMap;

    const unusedPercent =
      HUNDRED_PERCENTAGE - usedPercent - maxPercentOfChanceRatioMap;
    return { unusedPercent, usedPercent };
  }

  private calcWeight(
    groupMovementCounted: Map<ExtendedMovementCharacter, number>,
    recalculatedChanceRatio: ChanceRatioMapType
  ): WeightMapType {
    const totalItems = Array.from(groupMovementCounted.values()).reduce(
      (acc, cur) => acc + cur,
      0
    );
    const weightMap: WeightMapType = new Map<
      ExtendedMovementCharacter,
      number
    >();
    for (let [key, currentItemAmount] of groupMovementCounted.entries()) {
      const desirePercent = recalculatedChanceRatio.get(key) ?? 0;
      const desireItemAmount = round2((totalItems / 100) * desirePercent);
      const weight = round2(desireItemAmount / currentItemAmount);

      weightMap.set(key, weight);
    }
    return weightMap;
  }
}
