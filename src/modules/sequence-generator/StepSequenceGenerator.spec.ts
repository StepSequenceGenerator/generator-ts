import { beforeEach, describe, expect, it } from 'vitest';
import { StepSequenceGenerator } from './StepSequenceGenerator.js';
import { Movement } from '../movement/Movement.js';
import { movements as mockMovements } from '../../utils/test-utils/movements.js';
import { MovementLibrary } from '../movement/MovementLibrary.js';
import { StepContext } from './StepContext.js';
import { StepCounter } from './StepCounter.js';
import { RouletteGenerator } from '../roulette/RouletteGenerator.js';
import { MovementEqualizingWeightCalculator } from '../roulette/MovementEqualizingWeightCalculator.js';
import { IMovementExtended } from '../../shared/types/movement-extended.interface';
import { StepTracker } from '../sequence-tracker/StepTracker.js';
import { START_COORDINATES } from '../../shared/constants/start-coordinates';
import { VECTORS_TRACK } from '../../shared/constants/vectors-track';
import { VECTOR_ANGLES } from '../../shared/constants/vector-angles';
import { GeneratorFilterStrategiesFactoryDelete } from '../filter-strategy/BaseCompositeMovementFilters';

const mockMovementsFormated = mockMovements.map((movement) => new Movement(movement as Movement));

describe('StepSequenceGenerator', () => {
  const library: MovementLibrary = new MovementLibrary(mockMovementsFormated);
  const context: StepContext<IMovementExtended> = new StepContext<IMovementExtended>();
  const counter = new StepCounter();
  const equalizer = new MovementEqualizingWeightCalculator();
  const randomGenerator = new RouletteGenerator(equalizer);
  const tracker = new StepTracker(START_COORDINATES, VECTORS_TRACK, VECTOR_ANGLES);
  const filterStrategies = new GeneratorFilterStrategiesFactoryDelete();
  let generator: StepSequenceGenerator;
  beforeEach(() => {
    generator = new StepSequenceGenerator(
      library,
      context,
      counter,
      randomGenerator,
      tracker,
      filterStrategies,
    );
  });

  describe('implementation', () => {
    it('должен корректно создаваться', () => {
      expect(generator).toBeDefined();
      expect(generator).toBeInstanceOf(StepSequenceGenerator);
    });
  });

  // todo перенести в тесты для filterStrategies
  // describe('filterLibraryForNextStep', () => {
  //   describe('filter by Edge', () => {
  //     const edgeList = [Edge.OUTER, Edge.INNER];
  //     it.each(edgeList)('должен вернуть массив с Edge.%s и Edge.TWO_EDGES', (current) => {
  //       generator['context'].currentStep = { endEdge: current } as IMovementExtended;
  //       const result = generator['filterLibraryForNextStep']().movements;
  //       result.forEach((item) => {
  //         expect(item.startEdge === current || item.startEdge === Edge.TWO_EDGES).toBe(true);
  //       });
  //     });
  //   });
  //
  //   describe('filter by Leg', () => {
  //     const legList = [Leg.RIGHT, Leg.LEFT];
  //     it.each(legList)('должен вернуть массив с Leg.%s и Leg.BOTH', (current) => {
  //       generator['context'].currentStep = { endLeg: current } as IMovementExtended;
  //       const result = generator['filterLibraryForNextStep']().movements;
  //       result.forEach((item) => {
  //         expect(item.startLeg === current || item.startLeg === Leg.BOTH).toBe(true);
  //       });
  //     });
  //   });
  //
  //   describe('filter by TransitionDirection', () => {
  //     const transitionDirectionList = [TransitionDirection.FORWARD, TransitionDirection.BACKWARD];
  //     it.each(transitionDirectionList)(
  //       'должен вернуть массив с TransitionDirection.%s и TransitionDirection.NONE',
  //       (current) => {
  //         generator['context'].currentStep = {
  //           transitionDirection: current,
  //           rotationDirection: RotationDirection.NONE,
  //           rotationDegree: RotationDegree.DEGREES_0,
  //         } as IMovementExtended;
  //         const result = generator['filterLibraryForNextStep']().movements;
  //         result.forEach((item) => {
  //           expect(
  //             item.transitionDirection === current ||
  //               item.transitionDirection === TransitionDirection.NONE,
  //           ).toBe(true);
  //         });
  //       },
  //     );
  //   });
  // });

  describe('addStepToSequence', () => {
    it('должен увеличить длину stepSequence на 1', () => {
      generator['stepSequence'] = [];
      expect(generator['stepSequence'].length).toBe(0);
      generator['addStepToSequence']({} as IMovementExtended);
      expect(generator['stepSequence'].length).toBe(1);
    });
  });
});
