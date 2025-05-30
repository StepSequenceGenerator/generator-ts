import { AbstractWeightCalculator } from '../AbstractWeightCalculator';
import { VectorKey } from '../../../../shared/enums/vector-key.enum';

export class VectorKeyWeightCalculator extends AbstractWeightCalculator<VectorKey, VectorKey> {
  protected createChanceRatioKey(item: VectorKey): VectorKey {
    return item;
  }
}
