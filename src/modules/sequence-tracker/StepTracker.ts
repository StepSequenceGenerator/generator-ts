import { createCoordinates } from './utils';
import {
  VectorAngleType,
  VectorCursorType,
  VectorTrackType,
  XCursorType,
  YCursorType,
} from '../../shared/types/vector-type';
import {
  CoordinatesType,
  XCoordinateType,
  YCoordinateType,
} from '../../shared/types/coordinates-type';
import { VectorKey } from '../../shared/enums/vector-key-enum';

import { CoordinatesError, SequenceTrackerError } from '../../errors/custom-errors';
import { randomGenerator } from '../../utils/random-generator';

type CombinedCursorType = XCursorType | YCursorType;
type CoordinateForCursorType<T extends CombinedCursorType> = T extends XCursorType
  ? XCoordinateType
  : YCoordinateType;

export class StepTracker {
  readonly startCoordinates: ReadonlyArray<CoordinatesType>;
  readonly trackVectors: VectorTrackType;
  readonly vectorAngles: VectorAngleType;

  constructor(
    standardStartCoordinates: ReadonlyArray<CoordinatesType>,
    trackVectors: VectorTrackType,
    vectorAngles: VectorAngleType,
  ) {
    this.startCoordinates = standardStartCoordinates;
    this.vectorAngles = vectorAngles;
    this.trackVectors = trackVectors;
  }

  public getNextPosition(
    currentVector: VectorKey | null,
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

      if (newCoordinates)
        return {
          vector: vectorKey,
          coordinates: newCoordinates,
        };

      availableVectorKeys = this.filterVectorKeys(triedVectorKeys, availableVectorKeys);
    }

    console.debug('getNextPosition: Новые координаты не найдены');
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

    const newX = this.calcCoordinate({
      cursor: vectorCursor.x,
      coord: currentCoordinates.x,
      distance,
    });
    const newY = this.calcCoordinate({
      cursor: vectorCursor.y,
      coord: currentCoordinates.y,
      distance,
    });

    try {
      return createCoordinates(newX, newY);
    } catch (error) {
      if (error instanceof CoordinatesError && error.code === 'OUTSIDE_BOUNDS') return null;

      console.debug('getNewCoordinates; Неизвестная ошибка');
      throw error;
    }
  }

  private calcCoordinate<T extends CombinedCursorType>(data: {
    cursor: T;
    coord: CoordinateForCursorType<T>;
    distance: number;
  }): number {
    const { cursor, coord, distance } = data;
    return distance * cursor + coord;
  }

  getNextTrackVector(vectorKey: VectorKey): VectorCursorType {
    return this.trackVectors[vectorKey];
  }

  private getNextMovementVector(vectors: VectorKey[]) {
    if (vectors.length === 0)
      throw new SequenceTrackerError(
        'vectors.length should be more than 0',
        'NO_VECTOR_FOR_CHOICE',
      );
    const index = this.getRandom(0, vectors.length);
    return vectors[index];
  }

  private getAllowedVectorKeys(currentVector: VectorKey | null, maxTurnAngle: number = 90) {
    return currentVector === null
      ? (Object.keys(this.vectorAngles) as VectorKey[])
      : (Object.keys(this.vectorAngles) as VectorKey[]).filter((key) => {
          const diff = Math.abs(this.vectorAngles[currentVector] - this.vectorAngles[key]);
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
