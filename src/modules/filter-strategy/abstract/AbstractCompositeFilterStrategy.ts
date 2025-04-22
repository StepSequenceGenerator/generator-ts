import { IFilterStrategy } from './InterfaceFilterStrategy.js';

export class AbstractCompositeFilterStrategy<L, Args extends any[]>
  implements IFilterStrategy<L, Args>
{
  protected strategies: IFilterStrategy<L, Args>[] = [];

  constructor(strategies: IFilterStrategy<L, Args>[]) {
    this.strategies = strategies;
  }

  public filter(...args: Args): L {
    return this.strategies.reduce(
      (currentLibrary: L, strategy: IFilterStrategy<L, Args>) =>
        strategy.filter(...args),
      {} as L
    );
  }
}
