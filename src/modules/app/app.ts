import { ExcelWorkbookLoader } from '../file-parser/excel-book/ExcelWorkbookLoader.js';
import { BaseExcelParser } from '../file-parser/excel-parser/BaseExcelParser.js';
import { MapValueTypeBase } from '../../shared/types/map-value-type-base.js';
import { Movement } from '../movement/Movement.js';
import { MovementFactory } from '../movement/MovementFactory.js';
import { StepSequenceGenerator } from '../sequence-generator/StepSequenceGenerator.js';
import { UploaderAbstract } from '../uploader/UploaderAbstract.js';
import { WorkBook } from 'xlsx';
import { excelWorkbookLoader } from '../file-parser/excel-book/excel-book-loader.js';
import { defaultExcelParser } from '../file-parser/excel-parser/excel-parsers.js';

type AppConstructorType<T extends Record<string, string>> = {
  excelLoader: ExcelWorkbookLoader;
  excelParser: BaseExcelParser<T>;
  sequenceGenerator: StepSequenceGenerator;
  uploader: UploaderAbstract;
};

export class App<T extends Record<string, string>> {
  private excelLoader: ExcelWorkbookLoader;
  private excelParser: BaseExcelParser<T>;
  private sequenceGenerator: StepSequenceGenerator;
  private uploader: UploaderAbstract;

  constructor({
    excelLoader,
    excelParser,
    sequenceGenerator,
    uploader,
  }: AppConstructorType<T>) {
    this.excelLoader = excelLoader;
    this.excelParser = excelParser;
    this.sequenceGenerator = sequenceGenerator;
    this.uploader = uploader;
  }

  public loadExcelSource(
    dirPath: string,
    srcFileName: string,
    outFileName: string
  ) {
    const workBook = excelWorkbookLoader.getWorkBook(dirPath, srcFileName);
    const parsedData = defaultExcelParser.parse(workBook);
  }

  // todo разобраться где указывать ColumnName чтобы использовать в prepareDataForMovementLibrary и в DefaultExcelParser
  private prepareDataForMovementLibrary(
    data: Map<string, MapValueTypeBase>[],
    columnName: T
  ): Movement[] {
    const movements: Movement[] = [];
    for (const line of data) {
      const movement = MovementFactory.createFromExcelData<T>(line, columnName);
      movements.push(movement);
    }
    return movements;
  }
}
