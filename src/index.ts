import { twizzle } from './twizzle.js';
import { DifficultLevelAmountStep } from './shared/enums/difficult-level-amount-step-enum.js';
import { createDistanceFactor } from './shared/types/distance-factor.type';

export default twizzle;
export { DifficultLevelAmountStep };

if (process.env.NODE_ENV === 'development') {
  const tw = twizzle();
  tw.init();
  const distanceFactor = createDistanceFactor(3);
  const seq = tw.generateSequence(DifficultLevelAmountStep.LEVEL_4, distanceFactor);
  console.log(
    seq.map((item) => {
      return `distance: ${item.distance * distanceFactor} \n ${item.id}:  ${item.name} | ${item.startLeg} - ${item.endLeg} | x: ${item.coordinates.end.x} y: ${item.coordinates.end.x}`;
    }),
  );
}
