import { XlsxBook } from './file-parser/xlsx-book.js';
import { ExcelParser } from './file-parser/excel-parser.js';
import { ColumnName } from './enums/column-name-enum.js';
import { Movement } from './classes/Movement.js';
import { MovementFactory } from './classes/MovementFactory.js';
import { MovementLibrary } from './classes/MovementLibrary.js';

function run() {
  const PUBLIC_DIR =
    '/home/gen/Backstage/step-sequence-generator/generator-ts/public';
  const fileName = 'steps.xlsx';

  const xlsxBook = new XlsxBook(PUBLIC_DIR, fileName);
  const workBook = xlsxBook.getWorkBook();
  const parser = new ExcelParser<typeof ColumnName>(workBook, ColumnName);
  const parsedData = parser.parse();
  const preparedDataForLibrary = prepareDataForMovementLibrary<
    typeof ColumnName
  >(parsedData, ColumnName);

  const movementLibrary = new MovementLibrary(preparedDataForLibrary);
  // console.log(movementLibrary.movements);
}

function prepareDataForMovementLibrary<T extends Record<string, string>>(
  data: Map<string, string | number>[],
  columnName: T
) {
  const movements: Movement[] = [];
  for (const line of data) {
    const movement = MovementFactory.createFromExcelData<T>(line, columnName);
    movements.push(movement);
  }
  return movements;
}

run();
