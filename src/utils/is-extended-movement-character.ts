import { ExtendedMovementCharacter } from '../enums/movement-enums.js';

export function isExtendedMovementCharacter(value: string): boolean {
  return Object.values(ExtendedMovementCharacter).includes(value as any);
}
