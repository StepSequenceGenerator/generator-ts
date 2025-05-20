import { beforeEach, describe, expect, it } from 'vitest';
import { MovementLibrary } from '../../movement/MovementLibrary';
import { MovementCharacter } from '../../../shared/enums/movement-enums';
import { Movement } from '../../movement/Movement';
import { DifficultTurnsFilterStrategy } from './DifficultTurnsFilterStrategy';

const mockMovements = [
  { isDifficult: true, type: MovementCharacter.TURN, name: 'difficultTurn1' } as Movement,
  { isDifficult: true, type: MovementCharacter.TURN, name: 'difficultTurn2' } as Movement,
  { isDifficult: true, type: MovementCharacter.STEP, name: 'difficultTurn2' } as Movement,
  { isDifficult: false, type: MovementCharacter.STEP, name: 'difficultTurn2' } as Movement,
];

const mockLibrary = new MovementLibrary(mockMovements);
describe('DifficultTurnsFilterStrategy', () => {
  let strategy: DifficultTurnsFilterStrategy;
  beforeEach(() => {
    strategy = new DifficultTurnsFilterStrategy();
  });

  describe('implementation', () => {
    it('должен корректно создаваться', () => {
      expect(strategy).toBeDefined();
    });
  });

  describe('filter', () => {
    it('должен отфильтровать только сложные повороты', () => {
      const result = strategy.filter(mockLibrary);
      const expected = new MovementLibrary([
        { isDifficult: true, type: MovementCharacter.TURN, name: 'difficultTurn1' } as Movement,
        { isDifficult: true, type: MovementCharacter.TURN, name: 'difficultTurn2' } as Movement,
      ]);
      expect(result).toStrictEqual(expected);
    });
  });
});
