import { twizzle } from './twizzle.js';
import { utils } from './utils/exporting-utils';

export default twizzle;
export { utils };

if (process.env.NODE_ENV === 'development') {
  const tw = twizzle();
  tw.init();
  const distanceFactor = utils.createDistanceFactor(3);
  const seq = tw.generateSequence(utils.DifficultLevelAmountStep.LEVEL_4, distanceFactor);
  console.log(
    seq.map((item) => {
      return `distance: ${item.distance * distanceFactor} \n ${item.id}:  ${item.name} | ${item.startLeg} - ${item.endLeg} | x: ${item.coordinates.end.x} y: ${item.coordinates.end.x}`;
    }),
  );
}
