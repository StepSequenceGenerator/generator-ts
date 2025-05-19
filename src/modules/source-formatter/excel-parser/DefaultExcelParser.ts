import { BaseExcelParser } from './BaseExcelParser.js';
import { ColumnName } from '../../../shared/enums/column-name.enum';

type BaseExcelParserConstructor<T extends Record<string, string>> = new (
  columnName: T,
) => BaseExcelParser<T>;

class DefaultExcelParser extends BaseExcelParser<typeof ColumnName> {}

export { DefaultExcelParser, BaseExcelParserConstructor };
