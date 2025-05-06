import { CoordinatesType, XCoordinateType } from './types';

function createXCoordinate(x: number) {
  if (x < 1 && x > 59) {
    throw new Error(`X coordinate must be between 1 and 39. Got: ${x}`);
  } else {
    return x as XCoordinateType;
  }
}

function createYCoordinate(y: number) {
  if (y < 1 && y > 59) {
    throw new Error(`Y coordinate must be between 1 and 39. Got: ${y}`);
  } else {
    return y as XCoordinateType;
  }
}

function createCoordinates(x: number, y: number) {
  const xC = createXCoordinate(x);
  const yC = createYCoordinate(y);
  return { x: xC, y: yC } as unknown as CoordinatesType;
}

export { createCoordinates, createXCoordinate, createYCoordinate };
