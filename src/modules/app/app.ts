import { ExcelWorkbookLoader } from '../file-parser/excel-book/ExcelWorkbookLoader.js';
import { BaseExcelParser } from '../file-parser/excel-parser/BaseExcelParser.js';
import { MapValueTypeBase } from '../../shared/types/map-value-type-base.js';
import { Movement } from '../movement/Movement.js';
import { MovementFactory } from '../movement/MovementFactory.js';
import { StepSequenceGenerator } from '../sequence-generator/StepSequenceGenerator.js';

type AppConstructorType<T extends Record<string, string>> = {
  excelLoader: ExcelWorkbookLoader;
  excelParser: BaseExcelParser<T>;
  sequenceGenerator: StepSequenceGenerator;
};

export class App<T extends Record<string, string>> {
  private excelLoader: ExcelWorkbookLoader;
  private excelParser: BaseExcelParser<T>;
  private sequenceGenerator: StepSequenceGenerator;

  constructor({
    excelLoader,
    excelParser,
    sequenceGenerator,
  }: AppConstructorType<T>) {
    this.excelLoader = excelLoader;
    this.excelParser = excelParser;
    this.sequenceGenerator = sequenceGenerator;
  }

  prepareDataForMovementLibrary(
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
