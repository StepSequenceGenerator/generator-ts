import { ExtendedMovementCharacter } from '../shared/enums/movement-enums.js';

function isExtendedMovementCharacter(value: string): boolean {
  return Object.values(ExtendedMovementCharacter).includes(value as any);
}

function transformToExtendedMovementCharacterType(value: string): ExtendedMovementCharacter {
  return isExtendedMovementCharacter(value)
    ? (value as unknown as ExtendedMovementCharacter)
    : ExtendedMovementCharacter.UNKNOWN;
}

export { isExtendedMovementCharacter, transformToExtendedMovementCharacterType };
