import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StepSequenceGenerator } from './StepSequenceGenerator.js';
import { Movement } from '../classes/Movement.js';
import { movements as mockMovements } from '../utils/test-utils/movements.js';
import { MovementLibrary } from '../classes/MovementLibrary.js';
import { StepContext } from './StepContext.js';
import { Leg } from '../enums/movement-enums.js';

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
    const legList = [Leg.RIGHT, Leg.LEFT, Leg.BOTH];

    it.each(legList)('должен вернуть массив с %s', (currentLeg) => {
      generator['context'].currentStep = { endLeg: currentLeg } as Movement;
      const result = generator['filterLibraryForNextStep']();
      result.forEach((item) => {
        expect(item.startLeg).toBe(currentLeg);
      });
    });
  });
});
