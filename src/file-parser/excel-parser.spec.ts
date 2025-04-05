import { beforeEach, describe, expect, it } from 'vitest';
import { ExcelParser } from './excel-parser.js';

const mockWorkBook = {
  SheetNames: ['Sheet1', 'Sheet2'],
  Sheets: {},
};

enum mockColumnName {
  FAKE_NAME_1 = 'A',
  FAKE_NAME_2 = 'B',
  FAKE_NAME_3 = 'Z',
}

describe('ExcelParser', () => {
  let parser: ExcelParser<typeof mockColumnName>;
  beforeEach(() => {
    parser = new ExcelParser<typeof mockColumnName>(
      mockWorkBook,
      mockColumnName
    );
  });

  describe('implementation', () => {
    it('должен корректно создаваться', () => {
      expect(parser).toBeDefined();
      expect(parser).toBeInstanceOf(ExcelParser);
    });
  });

  describe('getFirstSheetsName', () => {
    it('Должен отдавать имя первого листа книги', () => {
      const receivedName = parser['getFirstSheetsName']();
      const expectedName = mockWorkBook.SheetNames[0];
      expect(receivedName).toBe(expectedName);
    });
  });

  describe('cleanUpAndSortSheetKeys', () => {
    it('не должно быть ключей, содержащих знак "!"', () => {
      const mockSheet = { '!margins': {}, A1: {} };
      const receivedKeys = parser['cleanUpAndSortSheetKeys'](
        Object.keys(mockSheet)
      );
      const expectedKeys = ['A1'];

      expect(receivedKeys).toStrictEqual(expectedKeys);
    });

    it('ключи листа должны быть отсортированы по возрастающей', () => {
      const mockSheet = { A1: {}, B1: {}, Z1: {}, A10: {}, B10: {}, Z10: {} };
      const receivedKeys = parser['cleanUpAndSortSheetKeys'](
        Object.keys(mockSheet)
      );
      const expectedKeys = ['A1', 'A10', 'B1', 'B10', 'Z1', 'Z10'];

      expect(receivedKeys).toStrictEqual(expectedKeys);
    });
  });

  describe('getColumnNamesLastKey', () => {
    it('должен отдать последний ключ в ColumnName', () => {
      const receivedKey = parser['getColumnNamesLastKey']();
      const expectedKey = 'FAKE_NAME_3';
      expect(receivedKey).toStrictEqual(expectedKey);
    });

    it('должен выбросить ошибку при отсутствии ключей в ColumnName', () => {
      enum mockWrongColumnName {}

      const parser = new ExcelParser<typeof mockWrongColumnName>(
        mockWorkBook,
        mockWrongColumnName
      );

      expect(() => parser['getColumnNamesLastKey']()).toThrow(
        'No columnNames defined'
      );
    });
  });

  describe('findLastLineNumber', () => {
    it('должен отдать номер линии в листе ', () => {
      const mockSheet = { A1: {}, B1: {}, Z1: {}, A10: {}, B10: {}, Z10: {} };
      const receivedNumber = parser['findLastLineNumber'](
        Object.keys(mockSheet),
        'FAKE_NAME_3'
      );
      const expectedNumber = 10;
      expect(receivedNumber).toStrictEqual(expectedNumber);
    });
  });

  describe('createLine and createData', () => {
    const mockSheet1 = {
      A2: { v: 'string value A2' },
      B2: { v: 'string value B2' },
      Z2: { v: '2' },
      A3: { v: 'string value A3' },
      B3: { v: 'string value B3' },
      Z3: { v: '3' },
      '!ref': 'A1:H1',
    };
    describe('createLine', () => {
      it('должен вернуть Map со значениями строки листа', () => {
        const receivedLine = parser['createLine'](
          mockSheet1,
          Object.keys(mockColumnName),
          2
        );

        const expectedLine = new Map<string, string | number>([
          ['A', 'string value a2'],
          ['B', 'string value b2'],
          ['Z', '2'],
        ]);

        expect(receivedLine).toStrictEqual(expectedLine);
      });
    });

    describe('createData', () => {
      it('должен вернуть массив Map со значениями всех строк листа', () => {
        const receivedData = parser['createData'](
          mockSheet1,
          3,
          Object.keys(mockColumnName)
        );

        const line1 = new Map<string, string | number>([
          ['A', 'string value a2'],
          ['B', 'string value b2'],
          ['Z', '2'],
        ]);
        const line2 = new Map<string, string | number>([
          ['A', 'string value a3'],
          ['B', 'string value b3'],
          ['Z', '3'],
        ]);
        const expectedData = [line1, line2];

        expect(receivedData).toStrictEqual(expectedData);
      });
    });
  });
});
