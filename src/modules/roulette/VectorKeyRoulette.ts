import { AbstractRoulette } from './AbstractRoulette';
import { VectorKey } from '../../shared/enums/vector-key.enum';
import { IUniversalWeightCalculator } from '../../shared/types/weight-calculator.interface';

export class VectorKeyRoulette extends AbstractRoulette<VectorKey, VectorKey> {
  protected readonly fallbackWeight = 0.1;

  constructor(weightCalc: IUniversalWeightCalculator) {
    super(weightCalc);
  }

  protected getWeightKey(item: VectorKey): VectorKey {
    return item;
  }
}
