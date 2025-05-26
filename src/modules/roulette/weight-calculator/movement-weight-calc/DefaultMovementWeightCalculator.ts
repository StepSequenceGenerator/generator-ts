import type { Movement } from '../../../movement/Movement';

import {
  MovementChanceRatioMapType,
  MovementWeightMapType,
} from '../../../../shared/types/chance-ratio-map.type';
import { round2 } from '../../../../utils/round2';
import { ExtendedMovementCharacter } from '../../../../shared/enums/movement-enums';
import { transformToExtendedMovementCharacterType } from '../../../../utils/is-extended-movement-character';

import { BaseMovementWeightCalculator } from './BaseMovementWeightCalculator';

export class DefaultMovementWeightCalculator extends BaseMovementWeightCalculator {
  public count(
    selection: Movement[],
    chanceRatioMap: MovementChanceRatioMapType,
  ): MovementWeightMapType {
    const groupMovementCounted = this.groupAndCountMovements(selection);
    const recalculatedChanceRatio = this.recalculateChanceRatio(
      Array.from(groupMovementCounted.keys()),
      chanceRatioMap,
    );

    return this.calcWeights(groupMovementCounted, recalculatedChanceRatio);
  }

  private recalculateChanceRatio(
    movementCharacterInUse: string[],
    chanceRatioMap: MovementChanceRatioMapType,
  ) {
    const actualChanceRatioMap: MovementChanceRatioMapType = this.getActualChanceRatioMap(
      movementCharacterInUse,
      chanceRatioMap,
    );

    const percentSeparated = this.separatePercentByType(actualChanceRatioMap);

    return this.redistributeChanceRatio(percentSeparated, actualChanceRatioMap);
  }

  private redistributeChanceRatio(
    percentSeparated: { unusedPercent: number; usedPercent: number },
    actualChanceRatioMap: Map<string, number>,
  ): MovementChanceRatioMapType {
    const map: MovementChanceRatioMapType = new Map<ExtendedMovementCharacter, number>();
    const { unusedPercent, usedPercent } = percentSeparated;
    const maxPercent = Math.max(...actualChanceRatioMap.values());
    // todo усовершенствовать для случаев, когда несколько элементов равны max
    const redistributionFactor = usedPercent === 0 ? 0 : round2(unusedPercent / usedPercent);

    for (const [key, percent] of actualChanceRatioMap.entries()) {
      const typedKey = transformToExtendedMovementCharacterType(key);
      const shouldAdjust = usedPercent === maxPercent || percent < maxPercent;

      const adjusted = shouldAdjust ? percent + percent * redistributionFactor : percent;
      map.set(typedKey, adjusted);
    }

    return map;
  }

  private getActualChanceRatioMap(
    charactersInUse: string[],
    chanceRatioMap: MovementChanceRatioMapType,
  ): MovementChanceRatioMapType {
    const map = new Map<ExtendedMovementCharacter, number>();
    for (const [key, percent] of chanceRatioMap.entries()) {
      if (charactersInUse.includes(key)) {
        map.set(key, percent);
      }
    }
    return map;
  }

  private separatePercentByType(actualChanceRatioMap: MovementChanceRatioMapType): {
    unusedPercent: number;
    usedPercent: number;
  } {
    const HUNDRED_PERCENTAGE = 100;
    // todo усовершенствовать для случаев, когда несколько элементов равны max
    const values = Array.from(actualChanceRatioMap.values());
    const max = Math.max(...values);
    const total = values.reduce((sum, value) => sum + value, 0);
    const used = max === total ? total : total - max;
    const unused = HUNDRED_PERCENTAGE - total;

    return { unusedPercent: unused, usedPercent: used };
  }

  protected calcWeights(
    groupMovementCounted: Map<ExtendedMovementCharacter, number>,
    recalculatedChanceRatio: MovementChanceRatioMapType,
  ): MovementWeightMapType {
    const totalItems = Array.from(groupMovementCounted.values()).reduce((acc, cur) => acc + cur, 0);
    const weightMap: MovementWeightMapType = new Map<ExtendedMovementCharacter, number>();
    for (let [key, currentItemAmount] of groupMovementCounted.entries()) {
      const desirePercent = recalculatedChanceRatio.get(key) ?? 0;
      const weight = this.calcItemWeight({ currentItemAmount, desirePercent, totalItems });

      weightMap.set(key, weight);
    }

    return weightMap;
  }
}
