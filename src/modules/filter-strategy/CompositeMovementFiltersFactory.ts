import { AbstractMovementFilterStrategy } from './abstract/AbstractMovementFilterStrategy';
import { BaseCompositeMovementFilters } from './BaseCompositeMovementFilters';

export class CompositeMovementFiltersFactory {
  static create(strategies: AbstractMovementFilterStrategy[]): BaseCompositeMovementFilters {
    return new BaseCompositeMovementFilters(strategies);
  }
}
