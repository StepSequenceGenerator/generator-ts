export type XCoordinateType = number & { __brand: 'XCoordinate' };
export type YCoordinateType = number & { __brand: 'YCoordinate' };
export type CoordinatesType = {
  x: XCoordinateType;
  y: YCoordinateType;
};
