import { beforeEach, describe, expect, it } from 'vitest';
import { BaseCompositeMovementFilters } from './BaseCompositeMovementFilters';
import {
  Edge,
  Leg,
  MovementCharacter,
  RotationDegree,
  TransitionDirection,
} from '../../shared/enums/movement-enums';
import { Movement } from '../movement/Movement';
import { MovementLibrary } from '../movement/MovementLibrary';
import { DefaultMovementFilterStrategy } from './DefaultMovementFilterStrategy';
import { DifficultTurnsFilterStrategy } from './DifficultTurnsFilterStrategy';
import { StepContext } from '../sequence-generator/StepContext';
import { IMovementExtended } from '../../shared/types/extended-movement/movement-extended.interface';

const currentMovement = {
  isDifficult: true,
  type: MovementCharacter.TURN,
  name: 'currentDifficultTurn',
  endEdge: Edge.OUTER,
  endLeg: Leg.RIGHT,
  transitionDirection: TransitionDirection.BACKWARD,
  rotationDegree: RotationDegree.DEGREE_180,
} as IMovementExtended;

const mockMovements = [
  {
    isDifficult: true,
    type: MovementCharacter.TURN,
    name: 'RESULT',
    startEdge: Edge.OUTER,
    startLeg: Leg.RIGHT,
    transitionDirection: TransitionDirection.FORWARD,
  } as Movement,
  {
    isDifficult: true,
    type: MovementCharacter.TURN,
    name: 'difficultTurn2',
    startEdge: Edge.INNER,
    startLeg: Leg.RIGHT,
    transitionDirection: 'forward',
  } as Movement,
  {
    isDifficult: true,
    type: MovementCharacter.STEP,
    name: 'difficultTurn2',
    startEdge: Edge.OUTER,
    startLeg: Leg.RIGHT,
    transitionDirection: 'forward',
  } as Movement,
  {
    isDifficult: false,
    type: MovementCharacter.GLIDE,
    name: 'glide',
    startEdge: Edge.INNER,
    startLeg: Leg.RIGHT,
    transitionDirection: 'forward',
  } as Movement,
];

const mockLibrary = new MovementLibrary(mockMovements);
const mockStepContext = new StepContext();

describe('BaseCompositeMovementFilters', () => {
  let compositeFilter: BaseCompositeMovementFilters;
  beforeEach(() => {
    const defaultFilterStrategy = new DefaultMovementFilterStrategy();
    const difficultTurnsFilterStrategy = new DifficultTurnsFilterStrategy();
    compositeFilter = new BaseCompositeMovementFilters([
      defaultFilterStrategy,
      difficultTurnsFilterStrategy,
    ]);
  });

  describe('implementation', () => {
    it('должен корректно создаваться', () => {
      expect(compositeFilter).toBeDefined();
    });
  });

  describe('filter', () => {
    it('должен вернуть корректный movement', () => {
      mockStepContext.currentStep = currentMovement;
      const expected = new MovementLibrary([
        {
          isDifficult: true,
          type: MovementCharacter.TURN,
          name: 'RESULT',
          startEdge: Edge.OUTER,
          startLeg: Leg.RIGHT,
          transitionDirection: TransitionDirection.FORWARD,
        } as Movement,
      ]);
      const result = compositeFilter.filter(mockLibrary, mockStepContext);
      expect(result).toStrictEqual(expected);
    });
  });
});
