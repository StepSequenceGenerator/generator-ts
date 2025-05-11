import { DistanceFactorType } from '../shared/types/distance-factor.type';

/**
 * Создаёт типизированное значение для масштаба дистанции шага.
 * @param value Параметры для расчёта расстояния.
 * @returns {DistanceFactorType} типизированне значение.
 * @example
 * const factor = utils.createDistanceFactor(3);
 */
export function createDistanceFactor(value: 1 | 2 | 3 | 4 | 5): DistanceFactorType {
  if (value < 1 || value > 5) {
    throw new RangeError(`Value must be less than 5 or more than 1, got ${value}`);
  }
  return value as DistanceFactorType;
}
