import { DefaultMovementFilterStrategy } from './strategies/DefaultMovementFilterStrategy';
import { DifficultTurnsFilterStrategy } from './strategies/DifficultTurnsFilterStrategy';
import { IsChangeLegFilterStrategy } from './strategies/IsChangeLegFilterStrategy';
import { CompositeMovementFiltersFactory } from './CompositeMovementFiltersFactory';
import { FilterStrategyName } from '../../shared/enums/filter-stategy-name.enum';
import { BaseCompositeMovementFilters } from './BaseCompositeMovementFilters';
import { MapMovementCompositeFilterType } from '../../shared/types/map-composite-filters.type';

export class FilterCompositeMapFactory {
  static createMap(filtersNames: FilterStrategyName[]): MapMovementCompositeFilterType {
    const map = new Map<FilterStrategyName, BaseCompositeMovementFilters>();
    filtersNames.forEach((filterName) => {
      const strategy = this.orderMap.get(filterName);
      if (!strategy) throw new Error(`Filter ${filterName} not found`);
      map.set(filterName, strategy);
    });
    return map;
  }

  private static orderMap = new Map<FilterStrategyName, BaseCompositeMovementFilters>([
    [FilterStrategyName.DEFAULT, this.createDefaultComposite()],
    [FilterStrategyName.THREE_DIFFICULT_TURNS, this.createThreeDifficultTurnsComposite()],
    [FilterStrategyName.IS_CHANGE_LEG, this.createIsChangeLegComposite()],
  ]);

  private static createDefaultComposite() {
    const defaultStrategy = this.createDefaultStrategy();
    return CompositeMovementFiltersFactory.create([defaultStrategy]);
  }

  private static createThreeDifficultTurnsComposite() {
    const defaultStrategy = this.createDefaultStrategy();
    const threeDifficultTurnsStrategy = this.createThreeDifficultTurnsStrategy();
    return CompositeMovementFiltersFactory.create([defaultStrategy, threeDifficultTurnsStrategy]);
  }

  private static createIsChangeLegComposite() {
    const defaultStrategy = this.createDefaultStrategy();
    const isChangeLegStrategy = this.createIsChangeLegStrategy();
    return CompositeMovementFiltersFactory.create([defaultStrategy, isChangeLegStrategy]);
  }

  private static createDefaultStrategy() {
    return new DefaultMovementFilterStrategy();
  }

  private static createThreeDifficultTurnsStrategy() {
    return new DifficultTurnsFilterStrategy();
  }

  private static createIsChangeLegStrategy() {
    return new IsChangeLegFilterStrategy();
  }
}
