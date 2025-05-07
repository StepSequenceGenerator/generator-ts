import {
  CoordinatesType,
  VectorCursorType,
  XCoordinateType,
  XCursorType,
  YCoordinateType,
  YCursorType,
} from './types';
import { CoordinatesError, VectorCursorError } from '../../errors/custom-errors';

function createCoordinates(x: number, y: number) {
  const xC = createCoord<XCoordinateType>('x', x);
  const yC = createCoord<YCoordinateType>('y', y);
  return { x: xC, y: yC } as unknown as CoordinatesType;
}

function createCoord<T>(coordName: string, coord: number): T {
  if (coord < 1 || coord > 59) {
    throw new CoordinatesError(
      `${coordName.toUpperCase()} coordinate must be between 1 and 39. Got: ${coord}`,
      'OUTSIDE_BOUNDS',
    );
  } else {
    return coord as T;
  }
}

function createVectorCursor(x: number, y: number): VectorCursorType {
  const xC = createCursor<XCursorType>(x);
  const yC = createCursor<YCursorType>(y);
  return { x: xC, y: yC } as unknown as VectorCursorType;
}

function createCursor<T>(n: number): T {
  if ([1, 0, -1].includes(n)) {
    return n as T;
  }
  console.debug('createCursor; Не допустимое значение для cursor');
  throw new VectorCursorError(
    `Не допустимое значение для cursor. Должно быть (1, 0, -1), получил ${n}`,
    'WRONG_CURSOR_VALUE',
  );
}

export { createCoordinates, createVectorCursor };
