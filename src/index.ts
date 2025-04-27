import { twizzle } from './twizzle.js';
import { DifficultLevelAmountStep } from './shared/enums/difficult-level-amount-step-enum.js';

export default twizzle;
export { DifficultLevelAmountStep };

const gen = twizzle();
gen.init();
const seq = gen.generateSequence(DifficultLevelAmountStep.LEVEL_4);
console.log(seq);
