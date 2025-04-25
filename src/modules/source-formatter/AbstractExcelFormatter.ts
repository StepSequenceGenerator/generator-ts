import { BaseExcelParser } from './excel-parser/BaseExcelParser.js';
import { UploaderAbstract } from '../uploader/UploaderAbstract.js';
import { IXlsxBook } from './excel-book-loader/IExcelBook.js';
import { BaseExcelParserConstructor } from './excel-parser/excel-parsers.js';

type AbstractExcelFormatterArgsType<T extends Record<string, string>> = {
  loader: IXlsxBook;
  parser: BaseExcelParser<T>;
  fileUploader: UploaderAbstract;
  columnName: T;
};

abstract class AbstractExcelFormatter<T extends Record<string, string>, D> {
  excelLoader: IXlsxBook;
  excelParser: BaseExcelParser<T>;
  fileUploader: UploaderAbstract;
  columnName: T;

  protected constructor({
    loader,
    parser,
    fileUploader,
    columnName,
  }: AbstractExcelFormatterArgsType<T>) {
    this.excelLoader = loader;
    this.excelParser = parser;
    this.fileUploader = fileUploader;
    this.columnName = columnName;
  }

  abstract loadSource(dirPath: string, srcFileName: string): D;
}

export { AbstractExcelFormatter, AbstractExcelFormatterArgsType };
