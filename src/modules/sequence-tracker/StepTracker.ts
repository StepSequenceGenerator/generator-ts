import { createCoordinates } from './utils';
import {
  VectorAngleType,
  VectorCursorType,
  VectorTrackType,
  XCursorType,
  YCursorType,
} from '../../shared/types/vector.type';
import {
  DescartesCoordinatesType,
  XCoordinateType,
  YCoordinateType,
} from '../../shared/types/descartes-coordinates.type';
import { VectorKey } from '../../shared/enums/vector-key.enum';

import { CoordinatesError, SequenceTrackerError } from '../../errors/custom-errors';
import { randomGenerator } from '../../utils/random-generator';
import { VectorKeyChanceRatioMapType } from '../../shared/types/movement-chance-ratio-map.type';
import { VECTOR_ANGLES } from '../../shared/constants/vector-angles';

const RB_PERCENTAGE = {
  total: 100,
  additionalPercentage: 10,
  specialPercentage: 20,
};

type CombinedCursorType = XCursorType | YCursorType;
type CoordinateForCursorType<T extends CombinedCursorType> = T extends XCursorType
  ? XCoordinateType
  : YCoordinateType;

export class StepTracker {
  readonly startCoordinates: ReadonlyArray<DescartesCoordinatesType>;
  readonly vectorsTrack: VectorTrackType;
  readonly vectorAngles: VectorAngleType;

  constructor(
    standardStartCoordinates: ReadonlyArray<DescartesCoordinatesType>,
    vectorsTrack: VectorTrackType,
    vectorAngles: VectorAngleType,
  ) {
    this.startCoordinates = standardStartCoordinates;
    this.vectorsTrack = vectorsTrack;
    this.vectorAngles = vectorAngles;
  }

  public getNextPosition(
    currentVectorKey: VectorKey | null,
    currentCoordinates: DescartesCoordinatesType,
    distance: number,
  ) {
    const triedVectorKeys = new Set<VectorKey>();
    let availableVectorKeys = this.getAllowedVectorKeys(currentVectorKey);
    let vectorKeyChanceRatioMap = this.getVectorKeyChanceRatioMap(
      currentVectorKey,
      availableVectorKeys,
    );

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

  private getVectorKeyChanceRatioMap(
    currentVectorKey: VectorKey,
    vectorKeys: VectorKey[],
  ): VectorKeyChanceRatioMapType {
    const currentAcrVectorFactor = 1; // note потом сделать параметром

    const vectorKeysWithNormalizeAngles = this.getVectorKeysWithNormalizeAngles(
      currentVectorKey,
      vectorKeys,
    );

    const baseChanceRatio = this.calcBaseChanceRatio(
      vectorKeysWithNormalizeAngles,
      currentAcrVectorFactor,
    );

    return this.createVectorKeyChanceRatioMap(
      vectorKeysWithNormalizeAngles,
      currentAcrVectorFactor,
      baseChanceRatio,
    );
  }

  private createVectorKeyChanceRatioMap(
    vectorKeysWithAngles: Map<VectorKey, number>,
    vectorFactor: number,
    baseChanceRation: number,
  ): VectorKeyChanceRatioMapType {
    const chanceRatioMap: VectorKeyChanceRatioMapType = new Map<VectorKey, number>();
    let chanceRatio = baseChanceRation;
    for (let [key, angle] of vectorKeysWithAngles.entries()) {
      if (this.preferredVectorCondition(angle, vectorFactor)) {
        chanceRatio = baseChanceRation + RB_PERCENTAGE.specialPercentage;
      } else if (this.sameVectorCondition(angle, vectorFactor)) {
        chanceRatio = baseChanceRation + RB_PERCENTAGE.additionalPercentage;
      }
      chanceRatioMap.set(key, chanceRatio);
    }

    return chanceRatioMap;
  }

  private calcBaseChanceRatio(vectorKeysWithAngles: Map<VectorKey, number>, vectorFactor: number) {
    const counter = {
      preferred: 0,
      same: 0,
      opposite: 0,

      get total() {
        return this.preferred + this.same + this.opposite;
      },
    };
    for (let angle of vectorKeysWithAngles.values()) {
      if (this.preferredVectorCondition(angle, vectorFactor)) {
        counter.preferred++;
      } else if (this.sameVectorCondition(angle, vectorFactor)) {
        counter.same++;
      } else {
        counter.opposite++;
      }
    }

    return (
      (RB_PERCENTAGE.total -
        counter.same * RB_PERCENTAGE.additionalPercentage -
        counter.preferred * RB_PERCENTAGE.specialPercentage) /
      counter.total
    );
  }

  private preferredVectorCondition(angle: number, vectorFactor: number) {
    const PREFERRED_ANGLE = 45 * vectorFactor;
    return angle === PREFERRED_ANGLE;
  }

  private sameVectorCondition(angle: number, vectorFactor: number) {
    return angle * vectorFactor >= 0;
  }

  private oppositeVectorCondition(angle: number, vectorFactor: number) {
    return angle * vectorFactor < 0;
  }

  private getVectorKeysWithNormalizeAngles(currentVectorKey: VectorKey, vectorKeys: VectorKey[]) {
    const map = new Map<VectorKey, number>();
    vectorKeys.forEach((vectorKey) => {
      const angleDiff = VECTOR_ANGLES[vectorKey] - VECTOR_ANGLES[currentVectorKey];
      const normalizeAngleDiff = ((angleDiff + 180) % 360) - 180;
      map.set(vectorKey, normalizeAngleDiff);
    });
    return map;
  }

  private filterVectorKeys(triedVectorKeys: Set<VectorKey>, vectorKeys: VectorKey[]) {
    return vectorKeys.filter((vectorKey: VectorKey) => !triedVectorKeys.has(vectorKey));
  }

  private getNewCoordinates(data: {
    vectorCursor: VectorCursorType;
    currentCoordinates: DescartesCoordinatesType;
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
    return this.vectorsTrack[vectorKey];
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
          const absoluteAngelDiff = Math.abs(
            this.vectorAngles[currentVector] - this.vectorAngles[key],
          );
          const normalizeAngleDiff = Math.min(absoluteAngelDiff, 360 - absoluteAngelDiff);

          return normalizeAngleDiff <= maxTurnAngle;
        });
  }

  public getStartCoordinates() {
    return this.startCoordinates[this.getRandom(0, this.startCoordinates.length - 1)];
  }

  private getRandom(min: number, max: number) {
    return randomGenerator(min, max);
  }
}
