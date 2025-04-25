import path from 'node:path';

export class Configuration {
  private readonly excelFilePath: string;
  private readonly excelFileName: string;

  constructor() {
    this.excelFilePath = process.env.EXCEL_DIR_PATH || '';
    this.excelFileName = process.env.EXCEL_FILE_NAME || '';
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
}
