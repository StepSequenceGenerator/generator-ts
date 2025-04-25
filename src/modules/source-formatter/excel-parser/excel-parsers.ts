import { BaseExcelParser } from './BaseExcelParser.js';
import { ColumnName } from '../../../shared/enums/column-name-enum.js';

type BaseExcelParserConstructor<T extends Record<string, string>> = new (
  columnName: T
) => BaseExcelParser<T>;

class DefaultExcelParser extends BaseExcelParser<typeof ColumnName> {}

const defaultExcelParser = new DefaultExcelParser(ColumnName);

export { DefaultExcelParser, BaseExcelParserConstructor, defaultExcelParser };
