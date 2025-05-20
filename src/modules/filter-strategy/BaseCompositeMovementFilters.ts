import { AbstractCompositeFilterStrategy } from './abstract/AbstractCompositeFilterStrategy.js';
import { IFilterStrategy } from './abstract/InterfaceFilterStrategy.js';

import { MovementLibrary } from '../movement/MovementLibrary.js';
import { StepContext } from '../sequence-generator/StepContext.js';
import { IMovementExtended } from '../../shared/types/extended-movement/movement-extended.interface';

export class BaseCompositeMovementFilters extends AbstractCompositeFilterStrategy<
  MovementLibrary,
  [MovementLibrary, StepContext<IMovementExtended>]
> {
  constructor(
    strategies: IFilterStrategy<
      MovementLibrary,
      [MovementLibrary, StepContext<IMovementExtended>]
    >[],
  ) {
    super(strategies);
  }

  public filter(library: MovementLibrary, stepContext: StepContext<IMovementExtended>) {
    return this.strategies.reduce((currentLibrary, strategy) => {
      return strategy.filter(currentLibrary, stepContext);
    }, library);
  }
}
