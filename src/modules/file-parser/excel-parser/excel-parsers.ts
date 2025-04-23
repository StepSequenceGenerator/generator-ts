import { BaseExcelParser } from './BaseExcelParser.js';
import { ColumnName } from '../../../enums/column-name-enum.js';

export class DefaultExcelParser extends BaseExcelParser<typeof ColumnName> {}

const defaultExcelParser = new DefaultExcelParser(ColumnName);

export { defaultExcelParser };
