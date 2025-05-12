import { describe, expect, it, vi } from 'vitest';
import * as Utils from './utils';
import { createCoordinates, createCursor, createVectorCursor } from './utils';
import { CursorValueType } from '../../shared/types/vector-type';

describe('Utils of StepTracker', () => {
  describe('Coordinates', () => {
    describe('createCoord', () => {
      it('должен выбрасывать ошибку при аргументе х > 59', () => {
        const inputNumber = 60;
        const inputName = 'x';
        expect(() => Utils.createCoord(inputName, inputNumber)).toThrowError(
          `${inputName.toUpperCase()} coordinate must be between 1 and 59. Got: ${inputNumber}`,
        );
      });

      it('должен выбрасывать ошибку при аргументе y > 29', () => {
        const inputNumber = 40;
        const inputName = 'y';
        expect(() => Utils.createCoord(inputName, inputNumber)).toThrowError(
          `${inputName.toUpperCase()} coordinate must be between 1 and 29. Got: ${inputNumber}`,
        );
      });

      it('должен выбрасывать ошибку при аргументе х < 0', () => {
        const inputNumber = 0;
        const inputName = 'x';
        expect(() => Utils.createCoord(inputName, inputNumber)).toThrowError(
          `${inputName.toUpperCase()} coordinate must be between 1 and 59. Got: ${inputNumber}`,
        );
      });
    });

    describe('createCoordinates', () => {
      it('должен вызывать метод createCoord', () => {
        const spy = vi.spyOn(Utils, 'createCoord');

        createCoordinates(45, 10);

        expect(spy).toHaveBeenCalledTimes(2); // x и y
        expect(spy).toHaveBeenCalledWith('x', 45);
        expect(spy).toHaveBeenCalledWith('y', 10);
      });
    });
  });

  describe('VectorCursor', () => {
    describe('createCursor', () => {
      const argsList = [1, 0, -1] as CursorValueType[];
      it.each(argsList)('должен вернуть %s', (arg) => {
        const result = createCursor(arg);
        expect(result).toEqual(arg);
      });

      it('должен выбросить ошибку при значении не из [1, 0, -1]', () => {
        const input = 2 as CursorValueType;
        expect(() => createCursor(input)).toThrowError(
          `Не допустимое значение для cursor. Должно быть (1, 0, -1), получил ${input}`,
        );
      });
    });

    describe('createVectorCursor', () => {
      it('должен вызывать метод createCursor', () => {
        const spy = vi.spyOn(Utils, 'createCursor');

        createVectorCursor(1, 0);

        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenCalledWith(1);
        expect(spy).toHaveBeenCalledWith(0);
      });
    });
  });
});
