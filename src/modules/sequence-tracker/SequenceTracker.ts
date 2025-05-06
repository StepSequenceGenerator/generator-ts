import { randomInt } from 'node:crypto';
import {
  CoordinatesType,
  TrackVectorType,
  VectorAngleType,
  VectorCursorType,
  XCoordinateType,
  XCursorType,
  YCoordinateType,
  YCursorType,
} from './types';
import { VectorKey } from './enums';
import { createCoordinates } from './utils';

export class SequenceTracker {
  standardStartCoordinates: CoordinatesType[];
  trackVectors: TrackVectorType;
  vectorAngles: VectorAngleType;
  constructor(
    standardStartCoordinates: CoordinatesType[],
    trackVectors: TrackVectorType,
    vectorAngles: VectorAngleType,
  ) {
    this.standardStartCoordinates = standardStartCoordinates;
    this.vectorAngles = vectorAngles;
    this.trackVectors = trackVectors;
  }

  public main(currentVector: VectorKey, currentCoordinates: CoordinatesType, distance: number) {
    const vectorKeys = this.filterAllowedVectorKeys(currentVector);
    const newVectorKey = this.getNextMovementVector(vectorKeys);
    const vectorCursor = this.getNextTrackVector(newVectorKey);
    return this.getNewCoordinates({
      vectorCursor,
      currentCoordinates,
      distance,
    });
  }

  private getNewCoordinates(data: {
    vectorCursor: VectorCursorType;
    currentCoordinates: CoordinatesType;
    distance: number;
  }) {
    const { vectorCursor, currentCoordinates, distance } = data;
    let localDistance = this.calcDistance(vectorCursor, distance);
    const newX = this.calcCoordinate({
      cursor: vectorCursor.x,
      coord: currentCoordinates.x,
      distance: localDistance,
    });
    const newY = this.calcCoordinate({
      cursor: vectorCursor.y,
      coord: currentCoordinates.y,
      distance: localDistance,
    });
    return createCoordinates(newX, newY);
  }

  private calcDistance(vectorCursor: VectorCursorType, distance: number) {
    return vectorCursor.x !== 0 && vectorCursor.y !== 0 ? Math.sqrt(distance) / 2 : distance;
  }

  private calcCoordinate<
    TR extends XCursorType | YCursorType,
    TD extends XCoordinateType | YCoordinateType,
  >(data: { cursor: TR; coord: TD; distance: number }) {
    const { cursor, coord, distance } = data;
    return distance * cursor + coord;
  }

  getNextTrackVector(vectorKey: VectorKey): VectorCursorType {
    return this.trackVectors[vectorKey];
  }

  private getNextMovementVector(vectors: VectorKey[]) {
    if (vectors.length === 0) throw new Error('vectors should be more than 0');
    const index = this.getRandom(0, vectors.length - 1);
    return vectors[index];
  }

  private filterAllowedVectorKeys(currentVector: VectorKey, maxTurnAngle: number = 90) {
    const currentAngle = this.vectorAngles[currentVector];
    return (Object.keys(this.vectorAngles) as VectorKey[]).filter((key) => {
      const angle = this.vectorAngles[key];
      const diff = Math.abs(currentAngle - this.vectorAngles[key]);
      return diff <= maxTurnAngle;
    });
  }

  public getStartCoordinates() {
    return this.getRandom(0, this.standardStartCoordinates.length - 1);
  }

  private getRandom(min: number, max: number) {
    return randomInt(min, max);
  }
}
