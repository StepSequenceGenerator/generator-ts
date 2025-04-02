import * as XLSX from 'xlsx';

import fs from 'fs';
import { XlsxBook } from './xlsx-book.js';

// Мокаем fs и xlsx для изоляции
// jest.mock('fs');
jest.mock('xlsx');
jest.mock('fs');

describe('xlsxBook', () => {
  const mockPublicDir = '/mock/public';
  const mockFileName = 'test.xlsx';
  const mockFilePath = `${mockPublicDir}/test.xlsx`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен создавать workbook из файла', () => {
    const mockBinaryData = 'mockBinaryData';
    const mockArrayBuffer = new Uint8Array([1, 2, 3]);
    const mockWorkBook = { Sheets: { Sheet1: {} } };

    (fs.readFileSync as jest.Mock).mockReturnValue(mockBinaryData);
    (XLSX.read as jest.Mock).mockReturnValue(mockWorkBook);

    const book = new XlsxBook(mockPublicDir, mockFileName);
    expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath, {
      encoding: 'binary',
    });
    expect(XLSX.read).toHaveBeenCalledWith(expect.any(Uint8Array), {
      type: 'array',
    });
    expect(book.getWorkBook()).toBe(mockWorkBook);
  });
});
