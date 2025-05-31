import { IChanceRatioMapGenerator } from './chance-ratio-map-generator.interface';
import { MovementChanceRatioMapType } from '../../shared/types/chance-ratio-map.type';

import { ExtendedMovementCharacter } from '../../shared/enums/movement-enums';
import { Movement } from '../movement/Movement';
import { transformToExtendedMovementCharacterType } from '../../utils/is-extended-movement-character';
import { round2 } from '../../utils/round2';

export interface IGetChanceRatioMapArgs {
  baseChanceRatioMap: MovementChanceRatioMapType;
  movements: Movement[];
}

export class MovementChanceRatioMapGenerator
  implements IChanceRatioMapGenerator<ExtendedMovementCharacter, MovementChanceRatioMapType>
{
  /**
   * getChanceRatioMap
   * @param args
   * @param {Movement[]} args.movements массив движений
   * @param {MovementChanceRatioMapType} args.baseChanceRatioMap базовый список шансов на выпадение элемента в процентах
   */
  getChanceRatioMap(args: IGetChanceRatioMapArgs): MovementChanceRatioMapType {
    const { baseChanceRatioMap, movements } = args;
    const groupMovementCounted = this.groupAndCountMovements(movements);
    return this.calcChanceRatio(Array.from(groupMovementCounted.keys()), baseChanceRatioMap);
  }

  protected groupAndCountMovements(selection: Movement[]) {
    const map = new Map<ExtendedMovementCharacter, number>();
    for (let item of selection) {
      const key = item.isDifficult
        ? ExtendedMovementCharacter.DIFFICULT
        : transformToExtendedMovementCharacterType(item.type);
      const value = map.get(key) || 0;
      map.set(key, value + 1);
    }

    return map;
  }

  private calcChanceRatio(
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
}
