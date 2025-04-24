import dotenv from 'dotenv';

import { ColumnName } from './enums/column-name-enum.js';
import { Movement } from './modules/movement/Movement.js';
import { MovementFactory } from './modules/movement/MovementFactory.js';
import { MovementLibrary } from './modules/movement/MovementLibrary.js';
import { StepSequenceGenerator } from './modules/sequence-generator/StepSequenceGenerator.js';

import { MapValueTypeBase } from './shared/types/map-value-type-base.js';
import { DifficultLevelAmountStep } from './enums/difficult-level-amount-step-enum.js';

import { defaultExcelParser } from './modules/source-formatter/excel-parser/excel-parsers.js';
import { excelWorkbookLoader } from './modules/source-formatter/excel-book/excel-book-loader.js';
import { stepContext } from './modules/sequence-generator/step-contexts.js';
import { stepCounter } from './modules/sequence-generator/step-counters.js';
import { rouletteGenerator } from './modules/roulette/roulette-generator.js';
import { uploaderMovement } from './modules/uploader/uploaders.js';

dotenv.config();

function run() {
  const PUBLIC_DIR: string = process.env.PUBLIC_DIR || '';
  const fileName = 'steps.xlsx';

  const workBook = excelWorkbookLoader.getWorkBook(PUBLIC_DIR, fileName);

  const parsedData = defaultExcelParser.parse(workBook);

  const preparedDataForLibrary = prepareDataForMovementLibrary<
    typeof ColumnName
  >(parsedData, ColumnName);

  // const uploaderMovement = new UploaderMovements();
  // uploaderMovement.upload(
  //   preparedDataForLibrary,
  //   `${PUBLIC_DIR}/movementsNew.ts`
  // );

  const movementLibrary = new MovementLibrary(preparedDataForLibrary);

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
