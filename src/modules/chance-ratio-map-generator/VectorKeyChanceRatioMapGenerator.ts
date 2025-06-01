import { VectorKey } from '../../shared/enums/vector-key.enum';
import { IChanceRatioMapGenerator } from './chance-ratio-map-generator.interface';
import { VectorKeyChanceRatioMapType } from '../../shared/types/roulette/chance-ratio-map.type';
import { VECTOR_ANGLES } from '../../shared/constants/vector-angles';
import { rbVectorKeyPercentageType } from '../../shared/types/roulette/vector-key-percentage.rb.type';

interface IBaseChanceRatioMapArg {
  currentAcrVectorIndex: number;
  vectorKeys: VectorKey[];
}

export interface IGetChanceVarietyChanceRatioMapArg extends IBaseChanceRatioMapArg {
  currentVectorKey: VectorKey;
}

export interface IGetChanceRatioMapArg extends IBaseChanceRatioMapArg {
  currentVectorKey: VectorKey | null;
  rbPercentage: rbVectorKeyPercentageType;
}

export class VectorKeyChanceRatioMapGenerator
  implements IChanceRatioMapGenerator<VectorKey, VectorKeyChanceRatioMapType>
{
  private _rbPercentage: rbVectorKeyPercentageType | null = null;

  public getChanceRatioMap(data: IGetChanceRatioMapArg): VectorKeyChanceRatioMapType {
    const { currentAcrVectorIndex, currentVectorKey, vectorKeys, rbPercentage } = data;
    this.rbPercentage = rbPercentage;

    if (currentVectorKey === null) return this.getFlatChanceRatioMap(vectorKeys);

    return this.getVariedChanceRatioMap({
      currentVectorKey,
      currentAcrVectorIndex,
      vectorKeys,
    });
  }

  private getFlatChanceRatioMap(vectorKeys: VectorKey[]): VectorKeyChanceRatioMapType {
    const flatChanceRatio = this.rbPercentage.total / vectorKeys.length;
    const chanceRatioMap: VectorKeyChanceRatioMapType = new Map<VectorKey, number>();
    vectorKeys.forEach((vectorKey) => chanceRatioMap.set(vectorKey, flatChanceRatio));
    return chanceRatioMap;
  }

  private getVariedChanceRatioMap(data: IGetChanceVarietyChanceRatioMapArg) {
    const { currentVectorKey, currentAcrVectorIndex, vectorKeys } = data;
    const vectorKeysWithNormalizeAngles = this.getVectorKeysWithNormalizeAngles(
      currentVectorKey,
      vectorKeys,
    );

    const baseChanceRatio = this.calcBaseChanceRatio(
      vectorKeysWithNormalizeAngles,
      currentAcrVectorIndex,
    );

    return this.createVariedChanceRatioMap(
      vectorKeysWithNormalizeAngles,
      currentAcrVectorIndex,
      baseChanceRatio,
    );
  }

  private getVectorKeysWithNormalizeAngles(currentVectorKey: VectorKey, vectorKeys: VectorKey[]) {
    const map = new Map<VectorKey, number>();
    vectorKeys.forEach((vectorKey) => {
      const angleDiff = VECTOR_ANGLES[vectorKey] - VECTOR_ANGLES[currentVectorKey];
      const normalizeAngleDiff = ((angleDiff + 180) % 360) - 180;
      map.set(vectorKey, normalizeAngleDiff);
    });
    return map;
  }

  private calcBaseChanceRatio(vectorKeysWithAngles: Map<VectorKey, number>, vectorFactor: number) {
    const counter = {
      preferred: 0,
      same: 0,
      opposite: 0,

      get total() {
        return this.preferred + this.same + this.opposite;
      },
    };

    for (let angle of vectorKeysWithAngles.values()) {
      if (this.preferredVectorCondition(angle, vectorFactor)) {
        counter.preferred++;
      } else if (this.sameVectorCondition(angle, vectorFactor)) {
        counter.same++;
      } else {
        counter.opposite++;
      }
    }

    return (
      (this.rbPercentage.total -
        counter.same * this.rbPercentage.additionalPercentage -
        counter.preferred * this.rbPercentage.specialPercentage) /
      counter.total
    );
  }

  private createVariedChanceRatioMap(
    vectorKeysWithAngles: Map<VectorKey, number>,
    vectorFactor: number,
    baseChanceRation: number,
  ): VectorKeyChanceRatioMapType {
    const chanceRatioMap: VectorKeyChanceRatioMapType = new Map<VectorKey, number>();
    let chanceRatio = baseChanceRation;
    for (let [key, angle] of vectorKeysWithAngles.entries()) {
      if (this.preferredVectorCondition(angle, vectorFactor)) {
        chanceRatio = baseChanceRation + this.rbPercentage.specialPercentage;
      } else if (this.sameVectorCondition(angle, vectorFactor)) {
        chanceRatio = baseChanceRation + this.rbPercentage.additionalPercentage;
      }
      chanceRatioMap.set(key, chanceRatio);
    }

    return chanceRatioMap;
  }

  private preferredVectorCondition(angle: number, vectorFactor: number) {
    const PREFERRED_ANGLE = 45 * vectorFactor;
    return angle === PREFERRED_ANGLE;
  }

  private sameVectorCondition(angle: number, vectorFactor: number) {
    return angle * vectorFactor >= 0;
  }

  private oppositeVectorCondition(angle: number, vectorFactor: number) {
    return angle * vectorFactor < 0;
  }

  private get rbPercentage() {
    if (this._rbPercentage === null) throw new Error('rbPercentage must be defined');
    return this._rbPercentage;
  }

  private set rbPercentage(value: rbVectorKeyPercentageType) {
    this._rbPercentage = value;
  }
}
