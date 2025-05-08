type XCoordinateType = number & { __brand: 'XCoordinate' };
type YCoordinateType = number & { __brand: 'YCoordinate' };
type CoordinatesType = {
  x: XCoordinateType;
  y: YCoordinateType;
};

export type { XCoordinateType, YCoordinateType, CoordinatesType };
