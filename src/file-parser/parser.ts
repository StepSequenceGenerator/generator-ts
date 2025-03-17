import * as XLSX from 'xlsx';
import { WorkSheet } from 'xlsx';
import { fileURLToPath } from 'node:url';
import path from 'path';
import * as fs from 'fs';

import { ColumnName } from '../enums/column-name-enum.js';

type ColumnNameKeyType = keyof typeof ColumnName;
type ColumnNameType = ColumnName;
type SheetLineType = Map<ColumnNameKeyType, string | number>
type ColumnNamesTupleType = Array<[ColumnNameKeyType, ColumnNameType]>

export function fileParser() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.join(__dirname, '../../public/steps.xlsx');
  const binaryData = fs.readFileSync(filePath, { encoding: 'binary' });
  const arrayBuffer = new Uint8Array(binaryData.length);
  for (let i = 0; i < arrayBuffer.length; i++) {
    arrayBuffer[i] = binaryData.charCodeAt(i) & 0xff;
  }
  const workBook = XLSX.read(arrayBuffer, { type: 'array' });

  if (workBook.SheetNames.length === 0) return;

  const firstSheetName = workBook.SheetNames[0];

  const sheet = workBook.Sheets[firstSheetName];

  const sheetKeys = cleanUpKeys(Object.keys(sheet))
    .sort((a, b) => a.localeCompare(b));

  const lastLineNumber: number = findLastLineNumber(sheetKeys, 'H');
  const columnNamesTuple: ColumnNamesTupleType = Object.entries(ColumnName) as ColumnNamesTupleType;

  const data = createData(sheet, lastLineNumber, columnNamesTuple);

  return data;
}

function createData(sheet: WorkSheet, lastLineNumber: number, cellNameKeysAndValue: ColumnNamesTupleType): SheetLineType[] {
  const data: SheetLineType[] = [];
  for (let i = 2; i <= lastLineNumber; i++) {
    const line = createLine(sheet, cellNameKeysAndValue, i);
    data.push(line);
  }
  return data;
}

function createLine(sheet: WorkSheet, cellNameKeysAndValue: ColumnNamesTupleType, index: number): SheetLineType {
  const line: SheetLineType = new Map();
  for (let [key, value] of cellNameKeysAndValue) {
    const cellKey = `${value}${index}`;
    const cellValue = sheet[cellKey].v;
    line.set(key, cellValue);
  }
  return line;
}


function cleanUpKeys(arr: string[]): string[] {
  const localArr = arr.slice();
  localArr.filter((item) => !item.includes('!'));

  return localArr;
}

function findLastLineNumber(arr: string[], lastColumnName: string): number {
  const arrLocal: number[] = [];

  arr.forEach((item) => {
    if (item.includes(lastColumnName)) {
      const num = item.replace(lastColumnName, '');
      if (Number.isInteger(Number(num))) arrLocal.push(Number(num));
    }
  });
  arrLocal.sort((a, b) => b - a);

  return arrLocal.length > 1 ? arrLocal[0] : 0;
}

