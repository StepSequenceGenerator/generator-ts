import { describe, expect, it, test } from 'vitest';
import { MovementFactory } from './MovementFactory.js';
import { Movement } from './Movement.js';
import {
  Edge,
  Leg,
  RotationDegrees,
  RotationDirection,
  TranslationDirection,
} from '../enums/movement-enums.js';

const RIGHT_LEG = 'правая';
const LEFT_LEG = 'левая';
const INNER_EDGE = 'внутреннее';
const OUTER_EDGE = 'наружное';
const TWO_EDGES = 'два ребра';

describe('MovementFactory', () => {
  const mockLine = new Map<string, string | number>([
    ['A', 'name'],
    ['B', 'правая'],
    ['C', 'левая'],
    ['D', 'наружное'],
    ['E', 'внутреннее'],
    ['F', '0'],
    ['G', '0'],
    ['H', '1'],
  ]);

  enum mockColumnName {
    NAME = 'A',
    START_LEG = 'B',
    END_LEG = 'C',
    START_EDGE = 'D',
    END_EDGE = 'E',
    TRANSLATION_DIRECTION = 'F',
    ROTATION_DIRECTION = 'G',
    IS_SPEED_INCREASE = 'H',
  }

  describe('implementation', () => {
    it('должен корректно создаваться', () => {
      const movement = MovementFactory.createFromExcelData<
        typeof mockColumnName
      >(mockLine, mockColumnName);
      expect(movement).toBeDefined();
      expect(movement).toBeInstanceOf(Movement);
    });
  });

  describe('parseName', () => {
    it('должен вернуть корректное название элемента', () => {
      const input = 'name';
      const expected = 'name';
      const result = getFuncResult('parseName', input);
      expect(result).toBe(expected);
    });

    it('должен вернуть "Неизвестный шаг" для пустой строки', () => {
      const input = '';
      const expected = 'Неизвестный шаг';
      const result = getFuncResult('parseName', input);
      expect(result).toBe(expected);
    });
  }); // parseName

  describe('parseTranslationDirection', () => {
    it('должен вернуть TranslationDirection.FORWARD', () => {
      const input = 0;
      const expected = TranslationDirection.FORWARD;
      const result = getFuncResult('parseTranslationDirection', input);
      expect(result).toBe(expected);
    });

    it('должен вернуть TranslationDirection.BACKWARD', () => {
      const input = 180;
      const expected = TranslationDirection.BACKWARD;
      const result = getFuncResult('parseTranslationDirection', input);
      expect(result).toBe(expected);
    });

    it('должен вернуть TranslationDirection.NONE', () => {
      const input = 'test';
      const expected = TranslationDirection.NONE;
      const result = getFuncResult('parseTranslationDirection', input);
      expect(result).toBe(expected);
    });
  });

  describe('parseRotationDirection', () => {
    it('должен вернуть RotationDirection.COUNTERCLOCKWISE', () => {
      const input = 180;
      const expected = RotationDirection.COUNTERCLOCKWISE;
      const result = getFuncResult('parseRotationDirection', input);
      expect(result).toBe(expected);
    });

    it('должен вернуть RotationDirection.CLOCKWISE', () => {
      const input = -180;
      const expected = RotationDirection.CLOCKWISE;
      const result = getFuncResult('parseRotationDirection', input);
      expect(result).toBe(expected);
    });

    it('должен вернуть RotationDirection.NONE', () => {
      const input = 0;
      const expected = RotationDirection.NONE;
      const result = getFuncResult('parseRotationDirection', input);
      expect(result).toBe(expected);
    });

    it('должен выбросить ошибку', () => {
      const input = 'test';

      expect(() => getFuncResult('parseRotationDirection', input)).toThrowError(
        'wrong value for rotationDirection'
      );
    });
  });

  describe('parseRotationDegree', () => {
    it('должен вернуть RotationDegrees.DEGREE_180', () => {
      const input = 180;
      const expected = RotationDegrees.DEGREE_180;
      const result = getFuncResult('parseRotationDegree', input);
      expect(result).toBe(expected);
    });

    it('должен вернуть RotationDegrees.DEGREES_0', () => {
      const input = 0;
      const expected = RotationDegrees.DEGREES_0;
      const result = getFuncResult('parseRotationDegree', input);
      expect(result).toBe(expected);
    });

    it('должен выбросить ошибку', () => {
      expect(() => getFuncResult('parseRotationDegree', 'test')).toThrowError(
        'wrong value for rotationDirection'
      );
    });
  });

  describe('parseLeg', () => {
    it('должен вернуть Leg.BOTH', () => {
      const input = `${RIGHT_LEG}, ${LEFT_LEG}`;
      const expected = Leg.BOTH;
      const result = getFuncResult('parseLeg', input);
      expect(result).toStrictEqual(expected);
    });

    it('должен вернуть Leg.LEFT', () => {
      const input = LEFT_LEG;
      const expected = Leg.LEFT;
      const result = getFuncResult('parseLeg', input);
      expect(result).toStrictEqual(expected);
    });

    it('должен вернуть Leg.RIGHT', () => {
      const input = RIGHT_LEG;
      const expected = Leg.RIGHT;
      const result = getFuncResult('parseLeg', input);
      expect(result).toStrictEqual(expected);
    });
  });

  describe('parseIsChangeLeg', () => {
    it('должен вернуть false', () => {
      const input1 = `${RIGHT_LEG}, ${LEFT_LEG}`;
      const input2 = `${RIGHT_LEG}, ${LEFT_LEG}`;
      const expected = false;
      const result = getFuncResult('parseIsChangeLeg', input1, input2);
      expect(result).toBe(expected);
    });

    it('должен вернуть true', () => {
      const input1 = `${RIGHT_LEG}, ${LEFT_LEG}`;
      const input2 = RIGHT_LEG;
      const expected = true;
      const result = getFuncResult('parseIsChangeLeg', input1, input2);
      expect(result).toBe(expected);
    });
  });

  describe('getLegList', () => {
    it('должен вернуть массив строк', () => {
      const input = `${RIGHT_LEG}, ${LEFT_LEG}`;
      const expected = [LEFT_LEG, RIGHT_LEG];
      const result = getFuncResult('getLegList', input);
      expect(result).toStrictEqual(expected);
    });

    it('должен вернуть отсортированный массив строк', () => {
      const input = '2, 1';
      const expected = ['1', '2'];
      const result = getFuncResult('getLegList', input);
      expect(result).toStrictEqual(expected);
    });

    it('должен вернуть массив строк без пробелов', () => {
      const input = ' 2 , 1 ';
      const expected = ['1', '2'];
      const result = getFuncResult('getLegList', input);
      expect(result).toStrictEqual(expected);
    });
  });

  describe('validateLegList', () => {
    describe('должен вернуть true', () => {
      const inputList = [[RIGHT_LEG], [LEFT_LEG]];
      const expected = true;
      test.each(inputList)('должен вернуть true c наличием "%s"', (input) => {
        const result = getFuncResult('validateLegList', input);
        expect(result).toBe(expected);
      });
    });

    it('должен выбросить ошибку при отсутствии в массиве "левая" или "правая"', () => {
      const input = ['wrongString'];
      expect(() => getFuncResult('validateLegList', input)).toThrowError(
        'wrong Leg'
      );
    });
  });

  describe('parseEdge', () => {
    it('должен вернуть Edge.OUTER', () => {
      const input = OUTER_EDGE;
      const expected = Edge.OUTER;
      const result = getFuncResult('parseEdge', input);
      expect(result).toBe(expected);
    });

    it('должен вернуть Edge.INNER', () => {
      const input = INNER_EDGE;
      const expected = Edge.INNER;
      const result = getFuncResult('parseEdge', input);
      expect(result).toBe(expected);
    });

    it('должен вернуть Edge.TWO_EDGES', () => {
      const input = TWO_EDGES;
      const expected = Edge.TWO_EDGES;
      const result = getFuncResult('parseEdge', input);
      expect(result).toBe(expected);
    });
  });

  describe('parseIsChangeEdge', () => {
    it('должен вернуть true', () => {
      const input1 = OUTER_EDGE;
      const input2 = INNER_EDGE;
      const expected = true;
      const result = getFuncResult('parseIsChangeEdge', input1, input2);
      expect(result).toBe(expected);
    });

    it('должен вернуть false', () => {
      const input1 = OUTER_EDGE;
      const input2 = OUTER_EDGE;
      const expected = false;
      const result = getFuncResult('parseIsChangeEdge', input1, input2);
      expect(result).toBe(expected);
    });
  });

  describe('validateEdge', () => {
    describe('должен вернуть true', () => {
      const inputList = [INNER_EDGE, OUTER_EDGE, TWO_EDGES];
      const expected = true;
      test.each(inputList)('validateEdge("%s")', (input) => {
        const result = getFuncResult('validateEdge', input);
        expect(result).toBe(expected);
      });
    });

    it('должен выбросить ошибку', () => {
      const input = 'wrongString';
      expect(() => getFuncResult('validateEdge', input)).toThrowError(
        'wrong value for edge'
      );
    });
  });

  describe('parseIsSpeedIncrease', () => {
    it('должен вернуть true', () => {
      const input = 1;
      const expected = true;
      const result = getFuncResult('parseIsSpeedIncrease', input);
      expect(result).toBe(expected);
    });

    it('должен вернуть false', () => {
      const input = 0;
      const expected = false;
      const result = getFuncResult('parseIsSpeedIncrease', input);
      expect(result).toBe(expected);
    });

    it('должен выбросить ошибку', () => {
      const input = 'wrongString';
      expect(() => getFuncResult('parseIsSpeedIncrease', input)).toThrowError(
        'wrong value for speedIncrease'
      );
    });
  });

  // eslint-disable-line no-explicit-any
  function getFuncResult(funcName: string, ...args: any) {
    // @ts-expect-error-ignore
    return MovementFactory[`${funcName}`](...args);
  }
});
