import { AbstractCompositeFilterStrategy } from './abstract/AbstractCompositeFilterStrategy.js';
import { IFilterStrategy } from './abstract/InterfaceFilterStrategy.js';

import { MovementLibrary } from '../movement/MovementLibrary.js';
import { StepContext } from '../sequence-generator/StepContext.js';

import { DefaultMovementFilterStrategy } from './DefaultMovementFilterStrategy.js';
import { DifficultTurnsFilterStrategy } from './DifficultTurnsFilterStrategy.js';
import { IMovementExtended } from '../../shared/types/movement-extended.interface';

export class BaseMovementFilterComposite extends AbstractCompositeFilterStrategy<
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
}

const defaultStrategy = new DefaultMovementFilterStrategy();
export const DefaultMovementFilterComposite = new BaseMovementFilterComposite([defaultStrategy]);

const difficultTurnsStrategy = new DifficultTurnsFilterStrategy();
export const DifficultTurnsFilterComposite = new BaseMovementFilterComposite([
  difficultTurnsStrategy,
  defaultStrategy,
]);
