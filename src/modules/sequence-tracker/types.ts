import { VectorKey } from './enums';

type XCoordinateType = number & { __brand: 'XCoordinate' };
type YCoordinateType = number & { __brand: 'YCoordinate' };
type CoordinatesType = {
  x: XCoordinateType;
  y: YCoordinateType;
};
type AxisType = 'x' | 'y';

type CursorValueType = 1 | 0 | -1;
type XCursorType = CursorValueType & { __brand: 'XCursor' };
type YCursorType = CursorValueType & { __brand: 'YCursor' };
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
  AxisType,
  TrackVectorType,
  VectorAngleType,
  VectorCursorType,
  XCursorType,
  YCursorType,
  CursorValueType,
};
