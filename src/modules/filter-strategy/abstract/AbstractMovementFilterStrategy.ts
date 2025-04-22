import { IFilterStrategy } from './InterfaceFilterStrategy.js';
import { MovementLibrary } from '../../movement/MovementLibrary.js';
import { StepContext } from '../../sequence-generator/StepContext.js';

export abstract class AbstractMovementFilterStrategy
  implements IFilterStrategy<MovementLibrary, [MovementLibrary, StepContext]>
{
  abstract filter(
    library: MovementLibrary,
    context: StepContext
  ): MovementLibrary;

  protected withDefault<T>(value: T | null | undefined, defaultValue: T): T {
    return value !== null && value !== undefined ? value : defaultValue;
  }
}
