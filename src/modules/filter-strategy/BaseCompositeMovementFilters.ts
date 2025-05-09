import { AbstractCompositeFilterStrategy } from './abstract/AbstractCompositeFilterStrategy.js';
import { IFilterStrategy } from './abstract/InterfaceFilterStrategy.js';

import { MovementLibrary } from '../movement/MovementLibrary.js';
import { StepContext } from '../sequence-generator/StepContext.js';

import { DefaultMovementFilterStrategy } from './DefaultMovementFilterStrategy.js';
import { DifficultTurnsFilterStrategy } from './DifficultTurnsFilterStrategy.js';
import { IMovementExtended } from '../../shared/types/movement-extended.interface';

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
}

const defaultStrategy = new DefaultMovementFilterStrategy();
export const DefaultMovementFilterComposite = new BaseCompositeMovementFilters([defaultStrategy]);

const difficultTurnsStrategy = new DifficultTurnsFilterStrategy();
export const DifficultTurnsFilterComposite = new BaseCompositeMovementFilters([
  difficultTurnsStrategy,
  defaultStrategy,
]);

export interface IGeneratorFilterStrategy<T> {
  strategies: { [keys: string]: T };
}

export interface IGeneratorExtendedFilterStrategy
  extends IGeneratorFilterStrategy<BaseCompositeMovementFilters> {
  strategies: {
    default: typeof DefaultMovementFilterComposite;
    difficultTurns: typeof DifficultTurnsFilterComposite;
  };

  get default(): BaseCompositeMovementFilters;

  get difficultTurns(): BaseCompositeMovementFilters;
}

export class GeneratorFilterStrategiesFactory implements IGeneratorExtendedFilterStrategy {
  public strategies: {
    default: typeof DefaultMovementFilterComposite;
    difficultTurns: typeof DifficultTurnsFilterComposite;
  };

  constructor() {
    this.strategies = {
      default: new BaseCompositeMovementFilters([difficultTurnsStrategy, defaultStrategy]),
      difficultTurns: new BaseCompositeMovementFilters([difficultTurnsStrategy, defaultStrategy]),
    };
  }

  get default() {
    return this.strategies.default;
  }

  get difficultTurns() {
    return this.strategies.difficultTurns;
  }
}
