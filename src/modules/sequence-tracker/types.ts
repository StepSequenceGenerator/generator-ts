import { VectorKey } from './enums';

type XCoordinateType = number & { __brand: 'XCoordinate' };
type YCoordinateType = number & { __brand: 'YCoordinate' };
type CoordinatesType = {
  x: XCoordinateType;
  y: YCoordinateType;
};

type TrackVectorType = Record<VectorKey, { x: number; y: number }>;

type VectorAngleType = Record<VectorKey, number>;

export type { CoordinatesType, XCoordinateType, YCoordinateType, TrackVectorType, VectorAngleType };
