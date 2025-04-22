export interface IFilterStrategy<L, Args extends any[]> {
  filter(...args: Args): L;
}
