import { WorkBook, WorkSheet } from 'xlsx';

type SheetKeysType = string[];

class ExcelParser<T extends Record<string, string>> {
  private readonly columnNames: T;
  private readonly workBook: WorkBook;

  constructor(workBook: WorkBook, columnNames: T) {
    this.workBook = workBook;
    this.columnNames = columnNames;
  }

  public parse() {
    const firstSheetName = this.getFirstSheetsName();
    const sheet = this.workBook.Sheets[firstSheetName];
    const lastLineNumber: number = this.findLastLineNumber(
      this.cleanUpAndSortSheetKeys(Object.keys(sheet)),
      this.getColumnNamesLastKey()
    );

    const columnNameKeys = Object.keys(this.columnNames);
    const data = this.createData(sheet, lastLineNumber, columnNameKeys);
    return data;
  }

  private getFirstSheetsName() {
    return this.workBook.SheetNames[0];
  }

  private findLastLineNumber(
    arr: SheetKeysType,
    lastColumnNameKey: string
  ): number {
    const numbers: number[] = [];

    arr.forEach((item) => {
      if (item.includes(this.columnNames[lastColumnNameKey])) {
        const number = item.replace(this.columnNames[lastColumnNameKey], '');
        if (Number.isInteger(Number(number))) numbers.push(Number(number));
      }
      //   TODO выбросить ошибку с else
    });

    numbers.sort((a, b) => b - a);

    return numbers.length > 0 ? numbers[0] : 1;
  }

  private cleanUpAndSortSheetKeys(arr: SheetKeysType): SheetKeysType {
    return arr
      .filter((item) => !item.includes('!'))
      .sort((a, b) => a.localeCompare(b));
  }

  private getColumnNamesLastKey(): string {
    const keys = Object.keys(this.columnNames);

    if (keys.length === 0) throw new Error('No columnNames defined');

    return keys[keys.length - 1];
  }

  private createData(
    sheet: WorkSheet,
    lastLineNumber: number,
    columnNameKeys: string[]
  ): Map<string, string | number>[] {
    const data: Map<string, string | number>[] = [];
    for (let i = 2; i <= lastLineNumber; i++) {
      const line = this.createLine(sheet, columnNameKeys, i);
      data.push(line);
    }
    return data;
  }

  private createLine(
    sheet: WorkSheet,
    columnNameKeys: string[],
    index: number
  ): Map<string, string | number> {
    const line: Map<string, string | number> = new Map();

    for (const key of columnNameKeys) {
      const cellKey = `${this.columnNames[key]}${index}`;
      if (sheet[cellKey]) {
        line.set(
          this.columnNames[key],
          String(sheet[cellKey].v).trim().toLowerCase()
        );
      } else {
        console.warn(`Ячейка ${cellKey} не найдена.`);
      }
    }
    return line;
  }
}

export { ExcelParser };
