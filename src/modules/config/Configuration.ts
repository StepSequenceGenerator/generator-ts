import path, { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export class Configuration {
  private readonly excelFilePath: string;
  private readonly excelFileName: string;

  constructor() {
    this.excelFilePath = this.setExcelFilePath();
    this.excelFileName = 'steps.xlsx';
  }

  public getExcelFilePath() {
    return path.join(this.excelFilePath, this.excelFileName);
  }

  public get excelPath() {
    return this.excelFilePath;
  }

  public get excelName() {
    return this.excelFileName;
  }

  setExcelFilePath() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const filePath = resolve(__dirname, '../../public/');
    return filePath;
  }
}
