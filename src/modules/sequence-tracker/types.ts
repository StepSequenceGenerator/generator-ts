import { VectorKey } from './enums';

type XCoordinateType = number & { __brand: 'XCoordinate' };
type YCoordinateType = number & { __brand: 'YCoordinate' };
type CoordinatesType = {
  x: XCoordinateType;
  y: YCoordinateType;
};

type XCursorType = number & { __brand: 'XCursor' };
type YCursorType = number & { __brand: 'YCursor' };
type VectorCursorType = {
  x: XCursorType;
  y: YCursorType;
};

type TrackVectorType = Record<VectorKey, VectorCursorType>;

type VectorAngleType = Record<VectorKey, number>;

export type {
  CoordinatesType,
  XCoordinateType,
  YCoordinateType,
  TrackVectorType,
  VectorAngleType,
  VectorCursorType,
  XCursorType,
  YCursorType,
};
