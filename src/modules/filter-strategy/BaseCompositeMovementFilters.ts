import { AbstractCompositeFilterStrategy } from './abstract/AbstractCompositeFilterStrategy.js';
import { IFilterStrategy } from './abstract/InterfaceFilterStrategy.js';

import { MovementLibrary } from '../movement/MovementLibrary.js';
import { StepContext } from '../sequence-generator/StepContext.js';

import { DefaultMovementFilterStrategy } from './DefaultMovementFilterStrategy.js';
import { DifficultTurnsFilterStrategy } from './DifficultTurnsFilterStrategy.js';
import { IMovementExtended } from '../../shared/types/movement-extended.interface';
import { AbstractMovementFilterStrategy } from './abstract/AbstractMovementFilterStrategy';
import { log } from 'node:util';

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

const defaultStrategy = new DefaultMovementFilterStrategy();
export const DefaultMovementFilterComposite = new BaseCompositeMovementFilters([defaultStrategy]);

const difficultTurnsStrategy = new DifficultTurnsFilterStrategy();
export const DifficultTurnsFilterComposite = new BaseCompositeMovementFilters([
  difficultTurnsStrategy,
  defaultStrategy,
]);

export interface IGeneratorFilterStrategy<T> {
  strategies: {
    default: T;
    [keys: string]: T;
  };

  get default(): BaseCompositeMovementFilters;
}

export interface IGeneratorExtendedFilterStrategy
  extends IGeneratorFilterStrategy<BaseCompositeMovementFilters> {
  strategies: {
    default: typeof DefaultMovementFilterComposite;
    difficultTurns: typeof DifficultTurnsFilterComposite;
  };

  get difficultTurns(): BaseCompositeMovementFilters;
}

export class GeneratorFilterStrategyFactory {
  static create(strategies: AbstractMovementFilterStrategy[]): BaseCompositeMovementFilters {
    return new BaseCompositeMovementFilters(strategies);
  }
}
