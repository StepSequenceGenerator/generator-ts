import { ExtendedMovementCharacter } from '../enums/movement-enums.js';

/**
 keys: типы поворотов + difficult;
 values: процент от общего числа движений в массиве;
 * */
type ChanceRatioMapType = Map<ExtendedMovementCharacter, number>;

/**
 keys: типы поворотов + difficult;
 values: вес движения в массиве
 * */
type WeightMapType = Map<ExtendedMovementCharacter, number>;

export { ChanceRatioMapType, WeightMapType };
