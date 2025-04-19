import { WorkBook } from 'xlsx';

export interface IXlsxBook {
  getWorkBook(publicDir: string, fileName: string): WorkBook;
}
