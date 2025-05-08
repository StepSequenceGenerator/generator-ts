import { VectorKey } from '../../modules/sequence-tracker/tracker-enums';

type AxisType = 'x' | 'y';

type CursorValueType = 1 | 0 | -1;
type XCursorType = CursorValueType & { __brand: 'XCursor' };
type YCursorType = CursorValueType & { __brand: 'YCursor' };
type VectorCursorType = {
  x: XCursorType;
  y: YCursorType;
};

type VectorTrackType = Record<VectorKey, VectorCursorType>;

type VectorAngleType = Record<VectorKey, number>;

export type {
  AxisType,
  VectorTrackType,
  VectorAngleType,
  VectorCursorType,
  XCursorType,
  YCursorType,
  CursorValueType,
};
