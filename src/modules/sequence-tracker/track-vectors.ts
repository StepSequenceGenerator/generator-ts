import { VectorKey } from './enums';
import { TrackVectorType } from './types';
import { createVectorCursor } from './utils';

export const trackVectors: Readonly<TrackVectorType> = {
  [VectorKey.NORTH]: createVectorCursor(0, 1),
  [VectorKey.SOUTH]: createVectorCursor(0, -1),
  [VectorKey.WEST]: createVectorCursor(-1, 0),
  [VectorKey.EAST]: createVectorCursor(1, 0),
  [VectorKey.NORTH_WEST]: createVectorCursor(-1, 1),
  [VectorKey.NORTH_EAST]: createVectorCursor(1, 1),
  [VectorKey.SOUTH_WEST]: createVectorCursor(-1, -1),
  [VectorKey.SOUTH_EAST]: createVectorCursor(1, -1),
};
