import { IFilterStrategy } from './InterfaceFilterStrategy.js';

abstract class AbstractCompositeFilterStrategy<L, Args extends unknown[]>
  implements IFilterStrategy<L, Args>
{
  protected strategies: IFilterStrategy<L, Args>[] = [];

  protected constructor(strategies: IFilterStrategy<L, Args>[]) {
    this.strategies = strategies;
  }

  abstract filter(...args: Args): L;
}

export { AbstractCompositeFilterStrategy };
