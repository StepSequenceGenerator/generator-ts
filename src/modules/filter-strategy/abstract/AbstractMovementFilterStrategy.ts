import { IFilterStrategy } from './InterfaceFilterStrategy.js';
import { MovementLibrary } from '../../movement/MovementLibrary.js';
import { StepContext } from '../../sequence-generator/StepContext.js';
import { IMovementExtended } from '../../../shared/types/movement-extended.interface';

export abstract class AbstractMovementFilterStrategy
  implements IFilterStrategy<MovementLibrary, [MovementLibrary, StepContext<IMovementExtended>]>
{
  abstract filter(
    library: MovementLibrary,
    context: StepContext<IMovementExtended>,
  ): MovementLibrary;

  protected withDefault<T>(value: T | null | undefined, defaultValue: T): T {
    return value !== null && value !== undefined ? value : defaultValue;
  }
}
