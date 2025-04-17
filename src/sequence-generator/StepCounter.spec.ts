import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StepCounter } from './StepCounter.js';
import { TurnAbsoluteName } from '../enums/turn-absolute-name-enum.js';
import { Movement } from '../movement/Movement.js';
import {
  MovementCharacter,
  RotationDegree,
  RotationDirection,
  RotationDirectionString,
} from '../enums/movement-enums.js';

describe('StepCounter', () => {
  let counter: StepCounter;

  beforeEach(() => {
    counter = new StepCounter();
  });

  describe('implementation', () => {
    it('должен корректно создаваться', () => {
      expect(counter).toBeDefined();
      expect(counter).toBeInstanceOf(StepCounter);
    });
  });

  //  note turns methods
  describe('turns methods', () => {
    describe('increaseDifficultAll', () => {
      it('должен увеличить на единицу turns.difficultAll', () => {
        counter['turns'].difficultAll = 1;
        counter['increaseTurnsDifficultAll']();

        const expected = 2;
        const result = counter.difficultTurnsAllAmount;

        expect(result).toEqual(expected);
      });
    });

    describe('increaseDifficultOrigin', () => {
      it('должен увеличить на единицу одно свойство в turns.difficultOrigin', () => {
        const turnAbsoluteName = TurnAbsoluteName.ROCKER;
        const currentDifficultOriginAmount = 1;
        counter['increaseDifficultOrigin'](
          turnAbsoluteName,
          currentDifficultOriginAmount
        );

        const expected = 2;
        const result = counter['turns'].difficultOrigin.get(turnAbsoluteName);

        expect(result).toEqual(expected);
      });
    });

    describe('getCurrentDifficultOriginAmount', () => {
      it('должен вернуть значение свойства в counter.turns', () => {
        const turnAbsoluteName = TurnAbsoluteName.ROCKER;
        counter['turns'].difficultOrigin.set(turnAbsoluteName, 1);

        const result =
          counter['getCurrentDifficultOriginAmount'](turnAbsoluteName);
        const expected = 1;

        expect(result).toEqual(expected);
      });
    });

    describe('conditionIsTurnDifficult', () => {
      it('должен вернуть true', () => {
        const mockMovement = {
          isDifficult: true,
          type: MovementCharacter.TURN,
        } as Movement;
        const result = counter['conditionIsTurnDifficult'](mockMovement);
        expect(result).toBeTruthy();
      });

      it('должен вернуть false', () => {
        const mockMovement = { isDifficult: false } as Movement;
        const result = counter['conditionIsTurnDifficult'](mockMovement);
        expect(result).toBeFalsy();
      });
    });

    describe('conditionToIncreaseDifficultOrigin', () => {
      it('должен вернуть true', () => {
        const turnAbsoluteName = TurnAbsoluteName.ROCKER;
        counter['turns'].difficultOrigin.set(turnAbsoluteName, 1);
        const result =
          counter['conditionToIncreaseDifficultOrigin'](turnAbsoluteName);
        expect(result).toBeTruthy();
      });

      it('должен вернуть false', () => {
        const turnAbsoluteName = TurnAbsoluteName.ROCKER;
        counter['turns'].difficultOrigin.set(turnAbsoluteName, 2);
        const result =
          counter['conditionToIncreaseDifficultOrigin'](turnAbsoluteName);
        expect(result).toBeFalsy();
      });
    });
  });

  // note rotations methods
  describe('rotations methods', () => {
    describe('mappingRotationDirection', () => {
      const propList: [RotationDirection, RotationDirectionString][] = [
        [
          RotationDirection.COUNTERCLOCKWISE,
          RotationDirectionString.COUNTERCLOCKWISE,
        ],
        [RotationDirection.NONE, RotationDirectionString.NONE],
        [RotationDirection.CLOCKWISE, RotationDirectionString.CLOCKWISE],
      ];
      it.each(propList)('должен преобразовывать %s в %s', (input, expected) => {
        const result = counter['mappingRotationDirection'](input);
        expect(result).toEqual(expected);
        expect(Object.values(RotationDirectionString)).toContain(result);
      });

      it('должен выбросить ошибку, если передано неверное значение', () => {
        const input = 'wrong value' as unknown as RotationDirection;
        expect(() => counter['mappingRotationDirection'](input)).toThrowError(
          'from mappingRotationDirection: Unrecognized RotationDirection'
        );
      });
    });

    describe('increaseRotations', () => {
      it('должен увеличить counter.rotations на 180', () => {
        const mockCurrentMovement = {
          rotationDegree: RotationDegree.DEGREE_180,
          rotationDirection: RotationDirection.CLOCKWISE,
        } as Movement;

        counter['increaseRotations'](mockCurrentMovement, 180);
        const expected = 360;
        const result = counter['rotations'].get(
          RotationDirectionString.CLOCKWISE
        );
        expect(result).toEqual(expected);
      });
    });

    describe('conditionToIncreaseRotations', () => {
      it('должен вернуть true (проверка первого условия)', () => {
        const mockCurrentMovement = {
          rotationDegree: RotationDegree.DEGREE_360,
          rotationDirection: RotationDirection.COUNTERCLOCKWISE,
        } as Movement;
        const mockLastStep = {
          rotationDirection: RotationDirection.CLOCKWISE,
        } as Movement;

        counter['lastStep'] = mockLastStep;

        const result =
          counter['conditionToIncreaseRotations'](mockCurrentMovement);
        expect(result).toBeTruthy();
      });

      it('должен вернуть true (проверка второго условия)', () => {
        const mockCurrentMovement = {
          rotationDegree: RotationDegree.DEGREE_180,
          rotationDirection: RotationDirection.CLOCKWISE,
        } as Movement;
        const mockLastStep = {
          rotationDirection: RotationDirection.CLOCKWISE,
        } as Movement;

        counter['lastStep'] = mockLastStep;

        const result =
          counter['conditionToIncreaseRotations'](mockCurrentMovement);
        expect(result).toBeTruthy();
      });

      it('должен вернуть false (проверка первого условия)', () => {
        const mockCurrentMovement = {
          rotationDegree: RotationDegree.DEGREES_0,
          rotationDirection: RotationDirection.CLOCKWISE,
        } as Movement;
        const mockLastStep = {
          rotationDirection: RotationDirection.CLOCKWISE,
        } as Movement;

        counter['lastStep'] = mockLastStep;

        const result =
          counter['conditionToIncreaseRotations'](mockCurrentMovement);
        expect(result).toBeFalsy();
      });

      it('должен вернуть false (проверка второго условия)', () => {
        const mockCurrentMovement = {
          rotationDegree: RotationDegree.DEGREE_180,
          rotationDirection: RotationDirection.CLOCKWISE,
        } as Movement;
        const mockLastStep = {
          rotationDirection: RotationDirection.COUNTERCLOCKWISE,
        } as Movement;

        counter['lastStep'] = mockLastStep;

        const result =
          counter['conditionToIncreaseRotations'](mockCurrentMovement);
        expect(result).toBeFalsy();
      });
    });
  });

  //   note public methods
  describe('public methods', () => {
    describe('update', () => {
      let counterAny: any;
      beforeEach(() => {
        counterAny = counter as unknown as any;
      });

      describe('должен вызывать', () => {
        const methodNameList = [
          'conditionIsTurnDifficult',
          'conditionToIncreaseDifficultOrigin',
          'conditionToIncreaseRotations',
          'increaseTurnsDifficultAll',
          'increaseDifficultOrigin',
          'increaseRotations',
          'updateLastStep',
        ];
        const mockMovement = {
          isDifficult: true,
          type: MovementCharacter.TURN,
          rotationDirection: RotationDirection.CLOCKWISE,
          rotationDegree: RotationDegree.DEGREE_360,
        } as Movement;
        it.each(methodNameList)('метод %s', (methodName) => {
          const spyFn = vi.spyOn(counterAny, methodName);
          counter.update(mockMovement);
          expect(spyFn).toHaveBeenCalled();
        });
      });
    });

    describe('difficultTurnsAllAmount', () => {
      it('должен вернуть общее количество используемых сложных поворотов', () => {
        counter['turns'].difficultAll = 10;
        const expected = 10;
        const result = counter.difficultTurnsAllAmount;
        expect(result).toBe(expected);
      });

      it('должен вернуть 0 если сложные повороты не установлены', () => {
        const expected = 0;
        const result = counter.difficultTurnsAllAmount;
        expect(result).toBe(expected);
      });
    });

    // todo написать тест
    describe('difficultTurnsOriginAmount', () => {
      it('должен вернуть количество сложных поворотов при условии, что каждый тип учитывается не более двух раз', () => {
        const test = 0;
      });
    });

    describe('rotationAmount', () => {
      it('должен вернуть объект с количеством поворотов в каждую сторону в градусах', () => {
        counter['rotations'].set(RotationDirectionString.CLOCKWISE, 360);
        counter['rotations'].set(RotationDirectionString.COUNTERCLOCKWISE, 720);

        const expected = {
          clockwise: 360,
          counterclockwise: 720,
        };
        const result = counter.rotationAmount;
        expect(result).toStrictEqual(expected);
      });

      it('должен вернуть объект с 0 для каждой стороны, если обороты не установлены', () => {
        const expected = {
          clockwise: 0,
          counterclockwise: 0,
        };
        const result = counter.rotationAmount;
        expect(result).toStrictEqual(expected);
      });
    });
  });
});
