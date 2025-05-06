import { randomInt } from 'node:crypto';
import { CoordinatesType, TrackVectorType, VectorAngleType } from './types';
import { VectorKey } from './enums';

export class SequenceTracker {
  standardStartCoordinates: CoordinatesType[];
  trackVector: TrackVectorType;
  vectorAngles: VectorAngleType;
  constructor(
    standardStartCoordinates: CoordinatesType[],
    trackVector: TrackVectorType,
    vectorAngles: VectorAngleType,
  ) {
    this.standardStartCoordinates = standardStartCoordinates;
    this.vectorAngles = vectorAngles;
    this.trackVector = trackVector;
  }

  private getAllowedVectorKeys(currentVector: VectorKey, maxTurnAngle: number = 90) {
    const currentAngle = this.vectorAngles[currentVector];
    return (Object.keys(this.vectorAngles) as VectorKey[]).filter((key) => {
      const angle = this.vectorAngles[key];
      const diff = Math.abs(currentAngle - this.vectorAngles[key]);
      return diff <= maxTurnAngle;
    });
  }

  public getStartCoordinates() {
    return this.getRandom(0, this.standardStartCoordinates.length);
  }

  private getRandom(min: number, max: number) {
    return randomInt(min, max);
  }
}
