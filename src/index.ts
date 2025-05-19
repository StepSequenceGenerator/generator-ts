import { twizzle } from './twizzle.js';

import { utils } from './utils/exporting-utils';
import { DifficultLevelAmountStep } from './shared/enums/difficult-level-amount-step-enum';
import type { DistanceFactorType } from './shared/types/distance-factor.type';

export type { DistanceFactorType };
export { utils, DifficultLevelAmountStep };
export default twizzle;

if (process.env.NODE_ENV === 'development') {
  const tw = twizzle();
  tw.init();
  const distanceFactor = utils.createDistanceFactor(3);
  const seq = tw.generateSequence(DifficultLevelAmountStep.LEVEL_3, distanceFactor);
  console.log(
    seq.map((item) => {
      return `
      distance: ${item.distance * distanceFactor}
      ${item.id}:  ${item.name} | ${item.startLeg} - ${item.endLeg} |
      x: ${item.coordinates?.end.x} y: ${item.coordinates?.end.x} |
      turnsBlockNumber: ${item.threeTurnsBlockInfo?.blockNumber}
      `;
    }),
  );
}
