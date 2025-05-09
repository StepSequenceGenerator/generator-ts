export interface IFilterStrategy<L, Args extends unknown[]> {
  filter(...args: Args): L;
}
