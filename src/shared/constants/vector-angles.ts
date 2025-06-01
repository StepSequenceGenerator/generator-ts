import { VectorKey } from '../enums/vector-key.enum';
import { VectorAngleType } from '../types/vector.type';

export const VECTOR_ANGLES: Readonly<VectorAngleType> = {
  [VectorKey.NORTH]: 0,
  [VectorKey.NORTH_EAST]: 45,
  [VectorKey.EAST]: 90,
  [VectorKey.SOUTH_EAST]: 135,
  [VectorKey.SOUTH]: 180,
  [VectorKey.SOUTH_WEST]: 225,
  [VectorKey.WEST]: 270,
  [VectorKey.NORTH_WEST]: 315,
};
