import { beforeEach, describe, expect, it } from 'vitest';
import { StepSequenceGenerator } from './StepSequenceGenerator.js';
import { movements as movementsCopy } from '../utils/test-utils/movements.js';
import { Movement } from '../classes/Movement.js';
import { MovementLibrary } from '../classes/MovementLibrary.js';
import { StepContext } from './StepContext.js';

const movementIdList = [
  'ID95',
  'ID100',
  'ID122',
  'ID22',
  'ID135',
  'ID124',
  'ID108',
  'ID36',
  'ID28',
  'ID32',
  'ID62',
];

const movementsCopyFiltered = movementsCopy
  .filter((item) => {
    return movementIdList.includes(item.id);
  })
  .map((item) => {
    return new Movement(item);
  });

describe('StepSequenceGenerator', () => {
  const library: MovementLibrary = new MovementLibrary(movementsCopyFiltered);
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

  describe('должен', () => {
    it('first step', () => {
      const stepIndex = movementsCopyFiltered.findIndex(
        (item) => item.id === 'ID95'
      );
      generator['context'].currentStep = movementsCopyFiltered[stepIndex];
      const result = generator['filterLibraryForNextStep'](); // вызов напрямую, иначе метод не триггернется

      // console.debug('currentStep', generator['context'].currentStep);
      // console.debug(result);
    });
  });
});
