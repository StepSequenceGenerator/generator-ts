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
import { CoordinatesError, SequenceTrackerError } from '../../errors/custom-errors';
import { randomGenerator } from '../../utils/random-generator';

export class SequenceTracker {
  readonly startCoordinates: ReadonlyArray<CoordinatesType>;
  readonly trackVectors: TrackVectorType;
  readonly vectorAngles: VectorAngleType;

  constructor(
    standardStartCoordinates: ReadonlyArray<CoordinatesType>,
    trackVectors: TrackVectorType,
    vectorAngles: VectorAngleType,
  ) {
    this.startCoordinates = standardStartCoordinates;
    this.vectorAngles = vectorAngles;
    this.trackVectors = trackVectors;
  }

  public getNextPosition(
    currentVector: VectorKey,
    currentCoordinates: CoordinatesType,
    distance: number,
  ) {
    const triedVectorKeys = new Set<VectorKey>();
    let availableVectorKeys = this.getAllowedVectorKeys(currentVector);

    while (availableVectorKeys.length > 0) {
      const vectorKey = this.getNextMovementVector(availableVectorKeys);
      triedVectorKeys.add(vectorKey);
      const vectorCursor = this.getNextTrackVector(vectorKey);
      const newCoordinates = this.getNewCoordinates({
        vectorCursor,
        currentCoordinates,
        distance,
      });

      if (newCoordinates) return newCoordinates;

      availableVectorKeys = this.filterVectorKeys(triedVectorKeys, availableVectorKeys);
    }

    console.debug('getNextPosition; Новые координаты не найдены');
    throw new SequenceTrackerError(
      'Unable to find next coordinates within bounds.',
      'NO_VALID_COORDINATES',
    );
  }

  private filterVectorKeys(triedVectorKeys: Set<VectorKey>, vectorKeys: VectorKey[]) {
    return vectorKeys.filter((vectorKey: VectorKey) => !triedVectorKeys.has(vectorKey));
  }

  private getNewCoordinates(data: {
    vectorCursor: VectorCursorType;
    currentCoordinates: CoordinatesType;
    distance: number;
  }) {
    const { vectorCursor, currentCoordinates, distance } = data;
    let adjustedDistance = this.calcDistance(vectorCursor, distance);

    const newX = this.calcCoordinate({
      cursor: vectorCursor.x,
      coord: currentCoordinates.x,
      distance: adjustedDistance,
    });
    const newY = this.calcCoordinate({
      cursor: vectorCursor.y,
      coord: currentCoordinates.y,
      distance: adjustedDistance,
    });

    try {
      return createCoordinates(newX, newY);
    } catch (error) {
      if (error instanceof CoordinatesError && error.code === 'OUTSIDE_BOUNDS') return null;

      console.debug('getNewCoordinates; Неизвестная ошибка');
      throw error;
    }
  }

  private calcDistance(vectorCursor: VectorCursorType, distance: number) {
    return vectorCursor.x !== 0 && vectorCursor.y !== 0 ? Math.sqrt(distance ** 2 * 2) : distance;
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
    // todo custom error
    if (vectors.length === 0) throw new Error('vectors should be more than 0');
    const index = this.getRandom(0, vectors.length - 1);
    return vectors[index];
  }

  private getAllowedVectorKeys(currentVector: VectorKey, maxTurnAngle: number = 90) {
    const currentAngle = this.vectorAngles[currentVector];
    return (Object.keys(this.vectorAngles) as VectorKey[]).filter((key) => {
      const diff = Math.abs(currentAngle - this.vectorAngles[key]);
      return diff <= maxTurnAngle;
    });
  }

  public getStartCoordinates() {
    return this.startCoordinates[this.getRandom(0, this.startCoordinates.length - 1)];
  }

  private getRandom(min: number, max: number) {
    return randomGenerator(min, max);
  }
}
