import { BaseExcelParser } from './BaseExcelParser.js';
import { ColumnName } from '../../enums/column-name-enum.js';

const defaultExcelParser = new BaseExcelParser<typeof ColumnName>(ColumnName);

export { defaultExcelParser };
