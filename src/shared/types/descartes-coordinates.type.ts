type XCoordinateType = number & { __brand: 'XCoordinate' };
type YCoordinateType = number & { __brand: 'YCoordinate' };
type DescartesCoordinatesType = {
  x: XCoordinateType;
  y: YCoordinateType;
};

export type { XCoordinateType, YCoordinateType, DescartesCoordinatesType };
