import { ExtendedMovementCharacter } from '../../enums/movement-enums';
import { VectorKey } from '../../enums/vector-key.enum';

// note обобщенные типы
type ChanceRatioMap<T> = Map<T, number>;
type WeightMapType<T> = Map<T, number>;

// note для Movement
/**
 keys: типы поворотов + DIFFICULT;
 values: процент от общего числа движений в массиве;
 * */
type MovementChanceRatioMapType = ChanceRatioMap<ExtendedMovementCharacter>;

/**
 keys: типы поворотов + DIFFICULT;
 values: вес движения в массиве
 * */
type MovementWeightMapType = WeightMapType<ExtendedMovementCharacter>;

// note для выбора вектора движения
type VectorKeyChanceRatioMapType = ChanceRatioMap<VectorKey>;
type VectorKeyWeightMapType = WeightMapType<VectorKey>;

export {
  ChanceRatioMap,
  WeightMapType,
  MovementChanceRatioMapType,
  MovementWeightMapType,
  VectorKeyChanceRatioMapType,
  VectorKeyWeightMapType,
};
