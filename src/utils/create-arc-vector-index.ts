import { ArcVectorIndexType } from '../shared/types/arc-vector/arc-vector-index.type';

export function createArcVectorIndex(value: number) {
  if ([-1, 0, 1].includes(value)) {
    return value as ArcVectorIndexType;
  } else {
    // todo сделать customError
    throw new Error('Unsupported step direction index');
  }
}
