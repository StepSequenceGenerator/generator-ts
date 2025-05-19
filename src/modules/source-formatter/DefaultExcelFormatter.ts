import {
  AbstractExcelFormatter,
  AbstractExcelFormatterArgsType,
} from './AbstractExcelFormatter.js';
import { ColumnName } from '../../shared/enums/column-name.enum';
import { Movement } from '../movement/Movement.js';
import { MapValueTypeBaseType } from '../../shared/types/map-value-type-base.type';
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
    data: Map<string, MapValueTypeBaseType>[],
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
