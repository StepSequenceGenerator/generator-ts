import { AbstractWeightCalculator } from '../AbstractWeightCalculator';
import { VectorKey } from '../../../../shared/enums/vector-key.enum';
import {
  VectorKeyChanceRatioMapType,
  VectorKeyWeightMapType,
} from '../../../../shared/types/chance-ratio-map.type';

export class VectorKeyWeightCalculator extends AbstractWeightCalculator<VectorKey, VectorKey> {
  public count(
    selection: VectorKey[],
    chanceRatioMap: VectorKeyChanceRatioMapType,
  ): VectorKeyWeightMapType {
    return this.calcWeights(selection, chanceRatioMap);
  }

  protected calcWeights(
    selection: VectorKey[],
    chanceRatioMap: VectorKeyChanceRatioMapType,
  ): VectorKeyWeightMapType {
    const totalItems = selection.length;
    const weightMap: VectorKeyWeightMapType = new Map<VectorKey, number>();

    selection.forEach((item) => {
      const desirePercent = chanceRatioMap.get(item) || 0;
      const weight = this.calcItemWeight({ currentItemAmount: 1, desirePercent, totalItems });
      weightMap.set(item, weight);
    });
    return weightMap;
  }
}
