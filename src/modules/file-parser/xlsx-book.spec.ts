import * as fs from 'fs';
import { XlsxBook } from './xlsx-book.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as XLSX from 'xlsx';
import { ExcelWorkbookLoader } from './ExcelWorkbookLoader.js';

const fakeWorkbook = { Sheets: {}, SheetNames: ['Sheet1'] };

vi.mock('fs', () => ({ readFileSync: vi.fn() }));
vi.mock('xlsx', () => ({
  read: vi.fn(() => fakeWorkbook),
}));

describe('ExcelWorkbookLoader', () => {
  let bookLoader: ExcelWorkbookLoader;
  const mockPublicDir = '/mock/public';
  const mockFileName = 'test.xlsx';
  const mockFilePath = `${mockPublicDir}/${mockFileName}`;

  beforeEach(() => {
    bookLoader = new ExcelWorkbookLoader();
    vi.resetAllMocks();
  });

  describe('implementation', () => {
    it('должен корректно создаваться', () => {
      expect(bookLoader).toBeDefined();
      expect(bookLoader).toBeInstanceOf(ExcelWorkbookLoader);
    });
  });

  describe('createPath', () => {
    it('должен возвращать корректный путь', () => {
      const receivedFilePath = bookLoader['getAbsolutePath'](
        mockPublicDir,
        mockFileName
      );
      expect(receivedFilePath).toBe(mockFilePath);
    });
  });

  describe('initializeWorkBook', () => {
    it('должен корректно загружать workbook', () => {
      const fakeBinaryData = Buffer.from('fake excel data');
      vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeBinaryData);

      new XlsxBook(mockPublicDir, mockFileName);

      expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath);
      expect(XLSX.read).toHaveBeenCalledWith(new Uint8Array(fakeBinaryData), {
        type: 'array',
      });
    });

    it('должен выбрасывать ошибку, если файл не найден', () => {
      (
        fs.readFileSync as unknown as ReturnType<typeof vi.fn>
      ).mockImplementation(() => {
        throw new Error('File not found');
      });

      expect(() => new XlsxBook(mockPublicDir, mockFileName)).toThrow(
        `Ошибка при чтении файла ${mockFilePath}: File not found`
      );
    });
  });

  describe('getWorkBook', () => {
    it('должен вернуть workbook', () => {
      const xlsxBook = new XlsxBook(mockPublicDir, mockFileName);
      const receivedBook = xlsxBook.getWorkBook();
      expect(receivedBook).toBe(fakeWorkbook);
    });
  });
});
