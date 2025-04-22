import { MovementLibrary } from '../movement/MovementLibrary.js';
import { StepContext } from '../sequence-generator/StepContext.js';
import { AbstractCompositeFilterStrategy } from './abstract/AbstractCompositeFilterStrategy.js';
import { IFilterStrategy } from './abstract/InterfaceFilterStrategy.js';

export class BaseCompositeMovementFilterStrategy extends AbstractCompositeFilterStrategy<
  MovementLibrary,
  [MovementLibrary, StepContext]
> {
  constructor(
    strategies: IFilterStrategy<
      MovementLibrary,
      [MovementLibrary, StepContext]
    >[]
  ) {
    super(strategies);
  }
}
