import * as XLSX from 'xlsx';
import { WorkBook } from 'xlsx';
import * as fs from 'node:fs';

class XlsxBook {
  private readonly publicDir: string;
  private readonly fileName: string;
  private readonly absoluteFilePath: string;
  private readonly workBook: WorkBook;

  constructor(publicDir: string, fileName: string) {
    this.publicDir = publicDir;
    this.fileName = fileName;
    this.absoluteFilePath = this.createPath();
    this.workBook = this.initializeWorkBook();
  }

  private createPath() {
    const cleanedFileName = this.fileName.replace(/\//g, '');
    return `${this.publicDir}/${cleanedFileName}`;
  }

  private initializeWorkBook() {
    try {
      const binaryData = fs.readFileSync(this.absoluteFilePath);
      const arrayBuffer = new Uint8Array(binaryData);

      return XLSX.read(arrayBuffer, { type: 'array' });
    } catch (error) {
      throw new Error(
        `Ошибка при чтении файла ${this.absoluteFilePath}: ${(error as Error).message}`
      );
    }
  }

  public getWorkBook(): WorkBook {
    return this.workBook;
  }
}

export { XlsxBook };
