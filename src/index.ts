import { twizzle } from './twizzle.js';
import { DifficultLevelAmountStep } from './shared/enums/difficult-level-amount-step-enum.js';

export default twizzle;
export { DifficultLevelAmountStep };

const tw = twizzle();
tw.init();
const seq = tw.generateSequence(DifficultLevelAmountStep.LEVEL_4);
console.log(seq.map((item) => `${item.id}: ${item.name} | ${item.startLeg} - ${item.endLeg}`));
