import * as fs from 'fs';
import { XlsxBook } from './xlsx-book.js';
import { describe, it, vi } from 'vitest';

vi.mock('fs', async (importOriginal) => {
  const actualFs = await importOriginal<typeof fs>();
  return {
    ...actualFs,
    readFileSync: vi.fn(() => Buffer.from('mock excel data')),
  };
});

describe('xlsxBook', () => {
  const mockPublicDir = '/mock/public';
  const mockFileName = 'test.xlsx';

  it('должен создавать workbook из файла', () => {
    const xlsxBook = new XlsxBook(mockPublicDir, mockFileName);
  });
});
