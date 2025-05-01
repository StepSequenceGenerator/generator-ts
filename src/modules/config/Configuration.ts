import path, { resolve } from 'node:path';

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
    return resolve(__dirname, '../../public/');
  }
}
