import dotenv from 'dotenv';

import { ExcelParser } from './file-parser/excel-parser.js';
import { ColumnName } from './enums/column-name-enum.js';
import { Movement } from './movement/Movement.js';
import { MovementFactory } from './movement/MovementFactory.js';
import { MovementLibrary } from './movement/MovementLibrary.js';
import { StepSequenceGenerator } from './sequence-generator/StepSequenceGenerator.js';
import { StepContext } from './sequence-generator/StepContext.js';

import { MapValueTypeBase } from './shared/types/map-value-type-base.js';
import { StepCounter } from './sequence-generator/StepCounter.js';
import { DifficultLevelAmountStep } from './enums/difficult-level-amount-step-enum.js';
import { RouletteGenerator } from './roulette/RouletteGenerator.js';
import { ExcelWorkbookLoader } from './file-parser/excel-workbook-loader.js';
import { MovementWeightCalculator } from './roulette/MovementWeightCalculator.js';

dotenv.config();

function run() {
  const PUBLIC_DIR: string = process.env.PUBLIC_DIR || '';
  const fileName = 'steps.xlsx';

  const xlsxBookLoader = new ExcelWorkbookLoader();
  const workBook = xlsxBookLoader.getWorkBook(PUBLIC_DIR, fileName);
  const parser = new ExcelParser<typeof ColumnName>(workBook, ColumnName);
  const parsedData = parser.parse();

  const preparedDataForLibrary = prepareDataForMovementLibrary<
    typeof ColumnName
  >(parsedData, ColumnName);

  // const uploaderMovement = new UploaderMovements();
  // uploaderMovement.upload(
  //   preparedDataForLibrary,
  //   `${PUBLIC_DIR}/movementsNew.ts`
  // );

  const movementLibrary = new MovementLibrary(preparedDataForLibrary);
  const stepContext = new StepContext();
  const stepCounter = new StepCounter();
  const weightCalc = new MovementWeightCalculator();
  const rouletteGenerator = new RouletteGenerator(weightCalc);
  const generator = new StepSequenceGenerator(
    movementLibrary,
    stepContext,
    stepCounter,
    rouletteGenerator
  );
  const sequence = generator
    .generate(DifficultLevelAmountStep.LEVEL_4)
    .map(
      (item, index) => `${index} : ${item.id} ${item.name} ${item.absoluteName}`
    );
  console.log('дорожка', sequence);
}

function prepareDataForMovementLibrary<T extends Record<string, string>>(
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

run();
