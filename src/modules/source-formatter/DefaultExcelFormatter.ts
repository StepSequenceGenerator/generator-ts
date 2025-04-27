import {
  AbstractExcelFormatter,
  AbstractExcelFormatterArgsType,
} from './AbstractExcelFormatter.js';
import { ColumnName } from '../../shared/enums/column-name-enum.js';
import { Movement } from '../movement/Movement.js';
import { MapValueTypeBase } from '../../shared/types/map-value-type-base.js';
import { MovementFactory } from '../movement/MovementFactory.js';

export class DefaultExcelFormatter extends AbstractExcelFormatter<typeof ColumnName, Movement[]> {
  constructor(args: AbstractExcelFormatterArgsType<typeof ColumnName>) {
    super(args);
  }

  loadSource(dirPath: string, srcFileName: string): Movement[] {
    const workBook = this.excelLoader.getWorkBook(dirPath, srcFileName);
    const parsedData = this.excelParser.parse(workBook);
    return this.prepareDataForMovementLibrary(parsedData, this.columnName);
  }

  private prepareDataForMovementLibrary(
    data: Map<string, MapValueTypeBase>[],
    columnName: typeof ColumnName,
  ): Movement[] {
    const movements: Movement[] = [];
    for (const line of data) {
      const movement = MovementFactory.createFromExcelData<typeof ColumnName>(line, columnName);
      movements.push(movement);
    }
    return movements;
  }
}
