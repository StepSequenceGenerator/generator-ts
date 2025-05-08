import { VectorKey } from '../tracker-enums';
import { VectorAngleType } from '../../../shared/types/vector-type';

export const VECTOR_ANGLES: Readonly<VectorAngleType> = {
  [VectorKey.NORTH]: 0,
  [VectorKey.SOUTH]: 180,
  [VectorKey.WEST]: -90,
  [VectorKey.EAST]: 90,
  [VectorKey.NORTH_WEST]: -45,
  [VectorKey.NORTH_EAST]: 45,
  [VectorKey.SOUTH_WEST]: -135,
  [VectorKey.SOUTH_EAST]: 135,
};
