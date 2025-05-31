import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Movement } from '../movement/Movement';
import { AbstractSequenceGenerator } from './AbstractSequenceGenerator';
import { StepCounter } from '../step-counter/StepCounter';
import { SequenceGeneratorFactory } from './SequenceGeneratorFactory';
import { IMovementExtended } from '../../shared/types/extended-movement/movement-extended.interface';
import { FilterStrategyName } from '../../shared/enums/filter-stategy-name.enum';
import { MovementChanceRatioMapType } from '../../shared/types/chance-ratio-map.type';
import { ExtendedMovementCharacter, MovementCharacter } from '../../shared/enums/movement-enums';

// const mockMovements = [{}] as Movement[];
const mockChanceRatioMap: MovementChanceRatioMapType = new Map<ExtendedMovementCharacter, number>([
  [ExtendedMovementCharacter.STEP, 0],
  [ExtendedMovementCharacter.TURN, 0],
  [ExtendedMovementCharacter.SEQUENCE, 0],
  [ExtendedMovementCharacter.HOP, 0],
  [ExtendedMovementCharacter.GLIDE, 0],
  [ExtendedMovementCharacter.UNKNOWN, 0],
  [ExtendedMovementCharacter.DIFFICULT, 100],
]);
const mockMovements: Movement[] = [
  { type: MovementCharacter.UNKNOWN, isDifficult: false } as Movement,
  { type: MovementCharacter.STEP, isDifficult: true } as Movement,
];

// @ts-expect-error TS2515
class testGenerator extends AbstractSequenceGenerator<StepCounter> {}

describe('AbstractSequenceGenerator', () => {
  let generator: testGenerator;
  // eslint-disable-next-line
  let generatorAny: any;
  beforeEach(() => {
    generator = SequenceGeneratorFactory.createDefaultGenerator(mockMovements);
    // eslint-disable-next-line
    generatorAny = generator as unknown as any;
  });

  describe('implementation', () => {
    it('должен корректно создаваться', () => {
      expect(generator).toBeDefined();
      expect(generator).instanceOf(AbstractSequenceGenerator);
    });
  });

  describe('getCoordinates', () => {
    it('должен вызывать getNextPosition', () => {
      const spyGetNextPosition = vi.spyOn(generatorAny.tracker, 'getNextPosition');
      generatorAny.getCoordinates({} as Movement);
      expect(spyGetNextPosition).toHaveBeenCalled();
    });

    it('должен возвращать объект с типом ICoordinates', () => {
      const result = generatorAny.getCoordinates({} as Movement);
      expect(result).toHaveProperty('vector');
      expect(result).toHaveProperty('start');
      expect(result).toHaveProperty('end');
    });
  });

  describe('stepSequenceUpdate', () => {
    it('должен добавить элемент в stepSequence', () => {
      generatorAny.stepSequence = [];
      generatorAny.stepSequenceUpdate({} as Movement);
      const result = generatorAny.stepSequence.length;
      expect(result).toEqual(1);
    });
  });

  describe('counterUpdate', () => {
    it('должен вызвать counter.update', () => {
      const spyUpdate = vi.spyOn(generatorAny.counter, 'update');
      generatorAny.counterUpdate({} as IMovementExtended);
      expect(spyUpdate).toHaveBeenCalled();
      expect(spyUpdate).toHaveBeenCalledWith({});
    });
  });

  describe('contextUpdate', () => {
    it('должен обновить context.currentStep', () => {
      generatorAny.context.currentStep = null;
      generatorAny.contextUpdate({} as IMovementExtended);
      const result = generatorAny.context.currentStep;
      expect(result).not.toEqual(null);
    });
  });

  describe('update', () => {
    const funcNameList = ['contextUpdate', 'counterUpdate', 'stepSequenceUpdate'];
    it.each(funcNameList)('должен вызывать %s', (funcName) => {
      const spyFunc = vi.spyOn(generatorAny, funcName);
      const input = {} as IMovementExtended;
      generatorAny.update(input);
      expect(spyFunc).toHaveBeenCalled();
      expect(spyFunc).toHaveBeenCalledWith(input);
    });
  });

  describe('reset', () => {
    const funcNameList = [
      {
        utilName: 'counter',
        funcName: 'reset',
      },
      {
        utilName: 'context',
        funcName: 'resetCurrentStep',
      },
    ];
    it.each(funcNameList)('должен вызывать %s', ({ utilName, funcName }) => {
      const spyFunc = vi.spyOn(generatorAny[utilName], funcName);
      generatorAny.reset();
      expect(spyFunc).toHaveBeenCalled();
    });
  });

  describe('getCurrentLibrary', () => {
    it('должен вызвать filterStrategy.filter', () => {
      const spyFilter = vi.spyOn(
        generatorAny.filterStrategy.get(FilterStrategyName.DEFAULT),
        'filter',
      );
      generatorAny.getCurrentLibrary(generatorAny.filterStrategy.get(FilterStrategyName.DEFAULT));
      expect(spyFilter).toHaveBeenCalled();
    });
  });

  describe('chooseMovement', () => {
    it('должен вызвать roulette.spinWheel', () => {
      const spyFilter = vi.spyOn(generatorAny.roulette, 'spinWheel');
      generatorAny.chooseMovement(mockMovements, mockChanceRatioMap);
      expect(spyFilter).toHaveBeenCalled();
    });

    it('должен вернуть объект', () => {
      const result = generatorAny.chooseMovement(mockMovements, mockChanceRatioMap);
      expect(result).toStrictEqual({ type: MovementCharacter.STEP, isDifficult: true } as Movement);
    });
  });

  describe('generateMovement', () => {
    const funcNameList = ['getCurrentLibrary', 'chooseMovement', 'getCoordinates'];
    it.each(funcNameList)('должен вызывать %s', (funcName) => {
      const spyFunc = vi.spyOn(generatorAny, funcName);
      const mockDistanceFactor = 1;
      generatorAny.generateMovement(
        mockDistanceFactor,
        generatorAny.filterStrategy.get(FilterStrategyName.DEFAULT),
      );
      expect(spyFunc).toHaveBeenCalled();
    });

    it('должен вернуть объект со свойство coordinates', () => {
      const mockDistanceFactor = 1;
      const result = generatorAny.generateMovement(
        mockDistanceFactor,
        generatorAny.filterStrategy.get(FilterStrategyName.DEFAULT),
      );
      expect(result).toHaveProperty('coordinates');
    });
  });
});
