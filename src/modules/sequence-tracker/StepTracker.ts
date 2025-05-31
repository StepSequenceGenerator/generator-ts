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

import { ArcVectorIndexType } from '../../shared/types/arc-vector/arc-vector-index.type';
import { RB_PERCENTAGE } from '../../shared/constants/rb-percentage/rb-vector-key-percentage';
import { VectorKeyChanceRatioMapGenerator } from '../chance-ratio-map-generator/VectorKeyChanceRatioMapGenerator';
import { VectorKeyChanceRatioMapType } from '../../shared/types/chance-ratio-map.type';
import { vectorKeyKeyExtractor } from '../roulette/weight-calculator/extractors';
import { Roulette } from '../roulette/Roulette';
import { vectorWeightKeyCreator } from '../roulette/number-generator/weight-key-creators';

type CombinedCursorType = XCursorType | YCursorType;
type CoordinateForCursorType<T extends CombinedCursorType> = T extends XCursorType
  ? XCoordinateType
  : YCoordinateType;

type GetNextPositionArgsType = {
  currentVectorKey: VectorKey | null;
  currentAcrVectorIndex: ArcVectorIndexType;
  currentCoordinates: DescartesCoordinatesType;
  distance: number;
};

type ConstructorArgsType = {
  standardStartCoordinates: ReadonlyArray<DescartesCoordinatesType>;
  vectorsTrack: VectorTrackType;
  vectorAngles: VectorAngleType;
  vectorKeyChanceRatioMapGenerator: VectorKeyChanceRatioMapGenerator;
  roulette: Roulette;
};

export class StepTracker {
  readonly startCoordinates: ReadonlyArray<DescartesCoordinatesType>;
  readonly vectorsTrack: VectorTrackType;
  readonly vectorAngles: VectorAngleType;
  readonly vectorKeyChanceRatioMapGenerator: VectorKeyChanceRatioMapGenerator;
  readonly roulette: Roulette;

  constructor(data: ConstructorArgsType) {
    const {
      standardStartCoordinates,
      vectorsTrack,
      vectorAngles,
      vectorKeyChanceRatioMapGenerator,
      roulette,
    } = data;
    this.startCoordinates = standardStartCoordinates;
    this.vectorsTrack = vectorsTrack;
    this.vectorAngles = vectorAngles;
    this.vectorKeyChanceRatioMapGenerator = vectorKeyChanceRatioMapGenerator;
    this.roulette = roulette;
  }

  /**
   * @arg data
   * @arg {VectorKey | null} data.currentVectorKey ключ вектора движения относительно поля
   * @arg {ArcVectorIndexType} data.currentAcrVectorIndex индекс дуги: по часовой или против часовой стрелки
   * @arg {DescartesCoordinatesType} data.currentCoordinates текущий координаты
   * @arg {number} data.distance расстояние, которое покрывает движение
   * */

  public getNextPosition(data: GetNextPositionArgsType) {
    const { currentVectorKey, currentAcrVectorIndex, currentCoordinates, distance } = data;
    const triedVectorKeys = new Set<VectorKey>();
    let availableVectorKeys = this.getAllowedVectorKeys(currentVectorKey);

    while (availableVectorKeys.length > 0) {
      const vectorKeyChanceRatioMap = this.vectorKeyChanceRatioMapGenerator.getChanceRatioMap({
        currentVectorKey,
        vectorKeys: availableVectorKeys,
        currentAcrVectorIndex,
        rbPercentage: RB_PERCENTAGE,
      });
      const vectorKey = this.getNextMovementVector(availableVectorKeys, vectorKeyChanceRatioMap);
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

  private getNextMovementVector(
    vectors: VectorKey[],
    chanceRatioMap: VectorKeyChanceRatioMapType,
  ): VectorKey {
    if (vectors.length === 0)
      throw new SequenceTrackerError(
        'vectors.length should be more than 0',
        'NO_VECTOR_FOR_CHOICE',
      );

    const index = this.roulette.spinWheel({
      selection: vectors,
      chanceRatioMap,
      itemKeyExtractor: vectorKeyKeyExtractor,
      weightKeyCreator: vectorWeightKeyCreator,
    });
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
