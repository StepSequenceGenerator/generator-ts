import { vi, describe, beforeEach, expect, it, test } from 'vitest';
import { UploaderMovements } from './UploaderMovements.js';

import {
  Edge,
  Leg,
  RotationDegree,
  RotationDirection,
  TransitionDirection,
} from '../enums/movement-enums.js';

describe('Uploader Movements', () => {
  let uploader: UploaderMovements;
  beforeEach(() => {
    uploader = new UploaderMovements();
  });

  describe('implementation', () => {
    it('должен корректно создаваться', () => {
      expect(uploader).toBeDefined();
      expect(uploader).toBeInstanceOf(UploaderMovements);
    });
  });

  describe('formatEnum', () => {
    it('должен возвращать строку с RotationDegree.DEGREE_180', () => {
      const mockJson = JSON.stringify({
        rotationDegree: 180,
      });

      const mockEnumMap = {
        rotationDegree: {
          obj: RotationDegree,
          name: 'RotationDegree',
        },
      };
      const expected = '{rotationDegree: RotationDegree.DEGREE_180}';
      const uploaderAny = uploader as any;
      const spy = vi.spyOn(uploaderAny, 'formatEnum');
      const result = uploaderAny.formatEnum(mockJson, mockEnumMap);
      expect(spy).toHaveBeenCalledWith(mockJson, mockEnumMap);
      expect(result).toEqual(expected);
    });
  });
});
