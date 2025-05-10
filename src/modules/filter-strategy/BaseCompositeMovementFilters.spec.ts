import { describe, it } from 'vitest';

describe('BaseCompositeMovementFilters', () => {
  it('test', () => {});

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
});
