import { ExtendedMovementCharacter } from '../enums/movement-enums.js';

// note общие типы
type ChanceRatioMap<T> = Map<T, number>;
type WeightMapType<T> = Map<T, number>;

// note для Movement
/**
 keys: типы поворотов + difficult;
 values: процент от общего числа движений в массиве;
 * */
type MovementChanceRatioMapType = ChanceRatioMap<ExtendedMovementCharacter>;

/**
 keys: типы поворотов + difficult;
 values: вес движения в массиве
 * */
type MovementWeightMapType = WeightMapType<ExtendedMovementCharacter>;

export { ChanceRatioMap, WeightMapType, MovementChanceRatioMapType, MovementWeightMapType };
