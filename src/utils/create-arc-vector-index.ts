import { ArcVectorIndexType } from '../shared/types/arc-vector/arc-vector-index.type';
import { UtilsError } from '../errors/custom-errors';

export function createArcVectorIndex(value: number) {
  if ([-1, 0, 1].includes(value)) {
    return value as ArcVectorIndexType;
  } else {
    throw new UtilsError('Unsupported step direction index', 'WRONG_VALUE');
  }
}
