import { XlsxBook } from './file-parser/xlsx-book.js';
import { ExcelParser } from './file-parser/excel-parser.js';
import { ColumnName } from './enums/column-name-enum.js';
import { Movement } from './classes/Movement.js';
import { MovementFactory } from './classes/MovementFactory.js';
import { MovementLibrary } from './classes/MovementLibrary.js';
import { StepSequenceGenerator } from './sequence-generator/StepSequenceGenerator.js';
import { StepContext } from './sequence-generator/StepContext.js';

function run() {
  const VISTA_LOCAL = '/home/user/WebstormProjects/generator-ts/public';
  const HOME_LOCAL =
    '/home/gen/Backstage/step-sequence-generator/generator-ts/public';
  const PUBLIC_DIR = VISTA_LOCAL;
  const fileName = 'steps.xlsx';

  const xlsxBook = new XlsxBook(PUBLIC_DIR, fileName);
  const workBook = xlsxBook.getWorkBook();
  const parser = new ExcelParser<typeof ColumnName>(workBook, ColumnName);
  const parsedData = parser.parse();
  const preparedDataForLibrary = prepareDataForMovementLibrary<
    typeof ColumnName
  >(parsedData, ColumnName);

  const movementLibrary = new MovementLibrary(preparedDataForLibrary);
  console.log(movementLibrary);
  const stepContext = new StepContext();
  const generator = new StepSequenceGenerator(movementLibrary, stepContext);
  console.log('дорожка', generator.generate(11));
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

// 5, 7, 9, 11
run();
