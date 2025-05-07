import { randomInt } from 'node:crypto';
// todo custom error
// todo test
export function randomGenerator(min: number, max: number) {
  if (max < 0) {
    throw new Error('from randomGenerator: Not enough maximum number');
  }
  return randomInt(min, max);
}
