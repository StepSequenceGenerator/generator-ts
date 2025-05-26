import { AbstractRouletteGenerator } from './AbstractRouletteGenerator';
import { VectorKey } from '../../shared/enums/vector-key.enum';
import { VectorKeyWeightCalculator } from './weight-calculator/vector-key-weight-calc/VectorKeyWeightCalculator';

export class VectorKeyRouletteGenerator extends AbstractRouletteGenerator<VectorKey, VectorKey> {
  protected readonly fallbackWeight = 0.1;

  constructor(weightCalc: VectorKeyWeightCalculator) {
    super(weightCalc);
  }

  protected getWeightKey(item: VectorKey): VectorKey {
    return item;
  }
}
