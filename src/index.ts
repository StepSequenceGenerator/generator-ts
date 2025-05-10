import { twizzle } from './twizzle.js';
import { DifficultLevelAmountStep } from './shared/enums/difficult-level-amount-step-enum.js';

export default twizzle;
export { DifficultLevelAmountStep };

if (process.env.NODE_ENV === 'development') {
  const tw = twizzle();
  tw.init();
  const seq = tw.generateSequence(DifficultLevelAmountStep.LEVEL_4);
  console.log(
    seq.map((item) => {
      return `${item.distance} \n ${item.id}:  ${item.name} | ${item.startLeg} - ${item.endLeg} | x: ${item.coordinates.end.x} y: ${item.coordinates.end.x}`;
    }),
  );
}
