import * as Utils from './utils';
import {
  AxisType,
  CoordinatesType,
  CursorValueType,
  VectorCursorType,
  XCoordinateType,
  XCursorType,
  YCoordinateType,
  YCursorType,
} from './types';
import { CoordinatesError, VectorCursorError } from '../../errors/custom-errors';

function createCoordinates(x: number, y: number) {
  const xC = Utils.createCoord<XCoordinateType>('x', x);
  const yC = Utils.createCoord<YCoordinateType>('y', y);
  return { x: xC, y: yC } as unknown as CoordinatesType;
}

function createCoord<T>(axis: AxisType, coord: number): T {
  let max = axis === 'x' ? 59 : 39;

  if (coord < 1 || coord > max) {
    throw new CoordinatesError(
      `${axis.toUpperCase()} coordinate must be between 1 and ${max}. Got: ${coord}`,
      'OUTSIDE_BOUNDS',
    );
  } else {
    return coord as T;
  }
}

function createVectorCursor(x: CursorValueType, y: CursorValueType): VectorCursorType {
  const xC = Utils.createCursor<XCursorType>(x);
  const yC = Utils.createCursor<YCursorType>(y);
  return { x: xC, y: yC } as unknown as VectorCursorType;
}

function createCursor<T>(n: CursorValueType): T {
  if ([1, 0, -1].includes(n)) {
    return n as T;
  }
  console.debug('createCursor; Не допустимое значение для cursor');
  throw new VectorCursorError(
    `Не допустимое значение для cursor. Должно быть (1, 0, -1), получил ${n}`,
    'WRONG_CURSOR_VALUE',
  );
}

export { createCoordinates, createVectorCursor, createCoord, createCursor };
