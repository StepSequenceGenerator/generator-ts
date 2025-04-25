import dotenv from 'dotenv';
import { App } from './modules/app/app.js';
import { ColumnName } from './shared/enums/column-name-enum.js';
import { ExcelWorkbookLoader } from './modules/source-formatter/excel-book-loader/ExcelWorkbookLoader.js';
import { BaseExcelParser } from './modules/source-formatter/excel-parser/BaseExcelParser.js';
import { UploaderMovements } from './modules/uploader/UploaderMovements.js';
import { DefaultExcelFormatter } from './modules/source-formatter/DefaultExcelFormatter.js';
import { Configuration } from './modules/config/Configuration.js';

dotenv.config();

export function twizzle(): App<typeof ColumnName> {
  const loader = new ExcelWorkbookLoader();
  const parser = new BaseExcelParser<typeof ColumnName>(ColumnName);
  const fileUploader = new UploaderMovements();
  const sourceFormatter = new DefaultExcelFormatter({
    loader,
    parser,
    fileUploader,
    columnName: ColumnName,
  });
  const config = new Configuration();
  return new App<typeof ColumnName>({ config, sourceFormatter });
}
