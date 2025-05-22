import { VectorKey } from '../enums/vector-key.enum';
import { VectorAngleType } from '../types/vector.type';

export const VECTOR_ANGLES: Readonly<VectorAngleType> = {
  [VectorKey.NORTH]: 0,
  [VectorKey.SOUTH]: 180, // base
  [VectorKey.WEST]: -90,
  [VectorKey.EAST]: 90, // 180 - 90 = 90
  [VectorKey.NORTH_WEST]: -45,
  [VectorKey.NORTH_EAST]: 45,
  [VectorKey.SOUTH_WEST]: -135,
  [VectorKey.SOUTH_EAST]: 135, // 180 - 135 = 45
};
