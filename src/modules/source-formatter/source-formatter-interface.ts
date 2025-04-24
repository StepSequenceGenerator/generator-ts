import { BaseExcelParser } from './excel-parser/BaseExcelParser.js';
import { UploaderAbstract } from '../uploader/UploaderAbstract.js';
import { IXlsxBook } from './excel-book/IExcelBook.js';

import { BaseExcelParserConstructor } from './excel-parser/excel-parsers.js';

export abstract class AbstractExcelFormatter<T extends Record<string, string>> {
  excelLoader: IXlsxBook;
  excelParser: BaseExcelParser<T>;
  uploader: UploaderAbstract;

  constructor(
    loader: IXlsxBook,
    parser: BaseExcelParserConstructor<T>,
    uploader: UploaderAbstract,
    columnName: T
  ) {
    this.excelLoader = loader;
    this.excelParser = new parser(columnName);
  }

  abstract load();
  abstract parser();
  prepareDataLibrary<T>();
}
