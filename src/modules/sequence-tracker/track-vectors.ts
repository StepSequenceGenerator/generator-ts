import { VectorKey } from './enums';
import { TrackVectorType } from './types';

export const trackVectors: Readonly<TrackVectorType> = {
  [VectorKey.NORTH]: { x: 0, y: 1 },
  [VectorKey.SOUTH]: { x: 0, y: -1 },
  [VectorKey.WEST]: { x: -1, y: 0 },
  [VectorKey.EAST]: { x: 1, y: 0 },
  [VectorKey.NORTH_WEST]: { x: -1, y: 1 },
  [VectorKey.NORTH_EAST]: { x: 1, y: 1 },
  [VectorKey.SOUTH_WEST]: { x: -1, y: -1 },
  [VectorKey.SOUTH_EAST]: { x: 1, y: -1 },
};
