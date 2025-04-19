import fs from 'node:fs';
import path from 'node:path';
import * as XLSX from 'xlsx';
import { IXlsxBook } from './IExcelBook.js';

export class ExcelWorkbookLoader implements IXlsxBook {
  public getWorkBook(publicDir: string, fileName: string) {
    const absolutePath = this.getAbsolutePath(publicDir, fileName);
    return this.initializeWorkBook(absolutePath);
  }

  private getAbsolutePath(publicDir: string, fileName: string): string {
    return path.join(publicDir, fileName);
  }

  private initializeWorkBook(absoluteFilePath: string) {
    try {
      const binaryData = fs.readFileSync(absoluteFilePath);
      const arrayBuffer = new Uint8Array(binaryData);

      return XLSX.read(arrayBuffer, { type: 'array' });
    } catch (error) {
      throw new Error(
        `Ошибка при чтении файла ${absoluteFilePath}: ${(error as Error).message}`
      );
    }
  }
}
