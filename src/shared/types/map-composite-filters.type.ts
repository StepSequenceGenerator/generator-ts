import { AbstractCompositeFilterStrategy } from '../../modules/filter-strategy/abstract/AbstractCompositeFilterStrategy';
import { MovementLibrary } from '../../modules/movement/MovementLibrary';
import { StepContext } from '../../modules/sequence-generator/StepContext';
import { IMovementExtended } from './extended-movement/movement-extended.interface';
import { BaseCompositeMovementFilters } from '../../modules/filter-strategy/BaseCompositeMovementFilters';

/**
 * Обобщённый тип для Map, хранящего композитные стратегии фильтрации.
 * @template L Тип библиотеки (например, MovementLibrary).
 * @template Args Тип аргументов для метода filter.
 */
type MapAbstractCompositeFilterType<
  L,
  Args extends unknown[],
  T extends AbstractCompositeFilterStrategy<L, Args>,
> = Map<string, T>;

/**
 * Тип для Map, хранящего стратегии фильтрации для MovementLibrary.
 */
type MapMovementCompositeFilterType = MapAbstractCompositeFilterType<
  MovementLibrary,
  [MovementLibrary, StepContext<IMovementExtended>],
  BaseCompositeMovementFilters
>;

export { MapAbstractCompositeFilterType, MapMovementCompositeFilterType };
