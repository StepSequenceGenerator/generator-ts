import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StepSequenceGenerator } from './StepSequenceGenerator.js';
import { Movement } from '../movement/Movement.js';
import { movements as mockMovements } from '../utils/test-utils/movements.js';
import { MovementLibrary } from '../movement/MovementLibrary.js';
import { StepContext } from './StepContext.js';
import {
  Edge,
  Leg,
  RotationDegree,
  RotationDirection,
  TransitionDirection,
} from '../enums/movement-enums.js';

const mockMovementsFormated = mockMovements.map(
  (movement) => new Movement(movement)
);

describe('StepSequenceGenerator', () => {
  const library: MovementLibrary = new MovementLibrary(mockMovementsFormated);
  const context: StepContext = new StepContext();
  let generator: StepSequenceGenerator;
  beforeEach(() => {
    generator = new StepSequenceGenerator(library, context);
  });

  describe('implementation', () => {
    it('должен корректно создаваться', () => {
      expect(generator).toBeDefined();
      expect(generator).toBeInstanceOf(StepSequenceGenerator);
    });
  });

  describe('generate', () => {
    it('должен вернуть последовательность шагов определенной длины', () => {
      const expected = 10;
      const result = generator.generate(expected).length;
      expect(result).toEqual(expected);
    });

    it('должен вернуть массив Movement', () => {
      const list = generator.generate(3);
      const result = list.every((item) => item instanceof Movement);
      expect(result).toBe(true);
    });

    it('должен добавлять элементы в свойство stepSequence', () => {
      const expected = 10;
      generator.generate(expected);
      const result = generator['stepSequence'].length;
      expect(result).toBe(expected);
    });

    const methodList = [
      'filterLibraryForNextStep',
      'getRandomIndex',
      'addStep',
    ];
    it.each(methodList)('должен вызывать метод %s', (methodName) => {
      const generatorAny = generator as unknown as any;
      const spyFn = vi.spyOn(generatorAny, methodName);
      generatorAny.generate(1);
      expect(spyFn).toHaveBeenCalled();
    });
  });

  describe('filterLibraryForNextStep', () => {
    describe('filter by Edge', () => {
      const edgeList = [Edge.OUTER, Edge.INNER];
      it.each(edgeList)(
        'должен вернуть массив с Edge.%s и Edge.TWO_EDGES',
        (current) => {
          generator['context'].currentStep = { endEdge: current } as Movement;
          const result = generator['filterLibraryForNextStep']();
          result.forEach((item) => {
            expect(
              item.startEdge === current || item.startEdge === Edge.TWO_EDGES
            ).toBe(true);
          });
        }
      );
    });

    describe('filter by Leg', () => {
      const legList = [Leg.RIGHT, Leg.LEFT];
      it.each(legList)(
        'должен вернуть массив с Leg.%s и Leg.BOTH',
        (current) => {
          generator['context'].currentStep = { endLeg: current } as Movement;
          const result = generator['filterLibraryForNextStep']();
          result.forEach((item) => {
            expect(
              item.startLeg === current || item.startLeg === Leg.BOTH
            ).toBe(true);
          });
        }
      );
    });

    describe('filter by TransitionDirection', () => {
      const transitionDirectionList = [
        TransitionDirection.FORWARD,
        TransitionDirection.BACKWARD,
      ];
      it.each(transitionDirectionList)(
        'должен вернуть массив с TransitionDirection.%s и TransitionDirection.NONE',
        (current) => {
          generator['context'].currentStep = {
            transitionDirection: current,
            rotationDirection: RotationDirection.NONE,
            rotationDegree: RotationDegree.DEGREES_0,
          } as Movement;
          const result = generator['filterLibraryForNextStep']();
          result.forEach((item) => {
            expect(
              item.transitionDirection === current ||
                item.transitionDirection === TransitionDirection.NONE
            ).toBe(true);
          });
        }
      );
    });
  });

  describe('getRandomIndex', () => {
    it('должен выбросить ошибку, если длинна массива для выбора = 0', () => {
      expect(() => {
        generator['getRandomIndex'](0);
      }).toThrowError('Not enough maximum number of steps');
    });
  });

  describe('addStep', () => {
    it('должен увеличить длину stepSequence на 1', () => {
      generator['stepSequence'] = [];
      expect(generator['stepSequence'].length).toBe(0);
      generator['addStep']({} as Movement);
      expect(generator['stepSequence'].length).toBe(1);
    });
  });
});
