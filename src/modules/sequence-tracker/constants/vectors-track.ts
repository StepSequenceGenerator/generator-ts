import { VectorKey } from '../tracker-enums';
import { VectorTrackType } from '../../../shared/types/vector-type';
import { createVectorCursor } from '../utils';

export const VECTORS_TRACK: Readonly<VectorTrackType> = {
  [VectorKey.NORTH]: createVectorCursor(0, 1),
  [VectorKey.SOUTH]: createVectorCursor(0, -1),
  [VectorKey.WEST]: createVectorCursor(-1, 0),
  [VectorKey.EAST]: createVectorCursor(1, 0),
  [VectorKey.NORTH_WEST]: createVectorCursor(-1, 1),
  [VectorKey.NORTH_EAST]: createVectorCursor(1, 1),
  [VectorKey.SOUTH_WEST]: createVectorCursor(-1, -1),
  [VectorKey.SOUTH_EAST]: createVectorCursor(1, -1),
};
