import { XlsxBook } from './file-parser/xlsx-book.js';
import { ExcelParser } from './file-parser/excel-parser.js';
import { ColumnName } from './enums/column-name-enum.js';
import { Movement } from './classes/Movement.js';
import { MovementFactory } from './classes/MovementFactory.js';

function run() {
  const PUBLIC_DIR =
    '/home/gen/Backstage/step-sequence-generator/generator-ts/public';
  const fileName = 'steps.xlsx';

  const xlsxBook = new XlsxBook(PUBLIC_DIR, fileName);
  const workBook = xlsxBook.getWorkBook();
  const parser = new ExcelParser<typeof ColumnName>(workBook, ColumnName);
  const lines = parser.parse();

  const movementLibrary: Movement[] = [];
  for (const line of lines) {
    const movement = MovementFactory.createFromExcelData<typeof ColumnName>(line, ColumnName);
    movementLibrary.push(movement);
  }
}

run();
