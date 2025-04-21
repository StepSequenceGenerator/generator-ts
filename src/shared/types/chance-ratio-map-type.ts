/**
 keys: типы поворотов + difficult;
 values: процент от общего числа движений в массиве;
 * */
type ChanceRatioMapType = Map<string, number>;

/**
 keys: типы поворотов + difficult;
 values: вес движения в массиве
 * */
type WeightMapType = Map<string, number>;

export { ChanceRatioMapType, WeightMapType };
