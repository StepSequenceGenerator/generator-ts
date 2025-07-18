import { IExcelParser } from './IExcelParser.js';
import { WorkBook, WorkSheet } from 'xlsx';
import { MapValueTypeBaseType } from '../../../shared/types/map-value-type-base.type';

type SheetKeysType = string[];

export class BaseExcelParser<T extends Record<string, string>> implements IExcelParser<T> {
  readonly columnNames: T;

  constructor(columnNames: T) {
    this.columnNames = columnNames;
  }

  public parse(workBook: WorkBook) {
    const firstSheetName = this.getFirstSheetsName(workBook);
    const sheet = workBook.Sheets[firstSheetName];
    const lastLineNumber: number = this.findLastLineNumber(
      this.cleanUpAndSortSheetKeys(Object.keys(sheet)),
    );

    const columnNameKeys = Object.keys(this.columnNames);
    return this.createData(sheet, lastLineNumber, columnNameKeys);
  }

  private getFirstSheetsName(workBook: WorkBook) {
    return workBook.SheetNames[0];
  }

  private findLastLineNumber(arr: SheetKeysType): number {
    const numbers: number[] = [];

    arr.forEach((item) => {
      const pattern = /\d+/;
      const number = item.match(pattern);

      if (Number.isInteger(Number(number))) numbers.push(Number(number));
    });

    numbers.sort((a, b) => b - a);
    return numbers.length > 0 ? numbers[0] : 1;
  }

  private cleanUpAndSortSheetKeys(arr: SheetKeysType): SheetKeysType {
    return arr.filter((item) => !item.includes('!')).sort((a, b) => a.localeCompare(b));
  }

  private createData(
    sheet: WorkSheet,
    lastLineNumber: number,
    columnNameKeys: string[],
  ): Map<string, MapValueTypeBaseType>[] {
    const data: Map<string, MapValueTypeBaseType>[] = [];
    for (let i = 2; i <= lastLineNumber; i++) {
      const line = this.createLine(sheet, columnNameKeys, i);
      data.push(line);
    }
    return data;
  }

  private createLine(
    sheet: WorkSheet,
    columnNameKeys: string[],
    index: number,
  ): Map<string, MapValueTypeBaseType> {
    const line: Map<string, MapValueTypeBaseType> = new Map();

    for (const key of columnNameKeys) {
      const cellKey = `${this.columnNames[key]}${index}`;

      if (key === this.columnNames.ID) {
        line.set(this.columnNames[key], cellKey);
        continue;
      }

      let cellValue: MapValueTypeBaseType;
      if (sheet[cellKey]) {
        cellValue = String(sheet[cellKey].v).trim().toLowerCase();
      } else {
        // console.warn(`Ячейка ${cellKey} не найдена.`);
        cellValue = null;
      }
      line.set(this.columnNames[key], cellValue);
    }
    return line;
  }
}
