import { RouletteGenerator } from './RouletteGenerator.js';
import { movementWeightCalc } from './weight-calcs.js';

export const rouletteGenerator = new RouletteGenerator(movementWeightCalc);
