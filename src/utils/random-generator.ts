import { randomInt } from 'node:crypto';
import { UtilsError } from '../errors/custom-errors';

export function randomGenerator(min: number, max: number) {
  if (max <= min) {
    throw new UtilsError(
      `from randomGenerator: Not enough maximum number. Should be > ${min}, got ${max}`,
      'WRONG_VALUE',
    );
  }
  return randomInt(min, max);
}
