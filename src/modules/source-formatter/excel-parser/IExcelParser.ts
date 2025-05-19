import { MapValueTypeBaseType } from '../../../shared/types/map-value-type-base.type';
import { WorkBook } from 'xlsx';

export interface IExcelParser<T extends Record<string, string>> {
  columnNames: T;

  parse(workBook: WorkBook): Map<string, MapValueTypeBaseType>[];
}
