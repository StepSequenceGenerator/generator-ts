import { DifficultLevelAmountStep } from './shared/enums/difficult-level-amount-step-enum.js';
import { twizzle } from './twizzle.js';

export default twizzle;
export { DifficultLevelAmountStep } from './shared/enums/difficult-level-amount-step-enum.js';

const generator = twizzle();
generator.init();
const sequence = generator.generateSequence(DifficultLevelAmountStep.LEVEL_4);
console.log(
  sequence.map((item, index) => `${index} : ${item.id} ${item.name}`)
);
