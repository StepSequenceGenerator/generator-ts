import { Movement } from '../movement/Movement.js';
import { TurnAbsoluteName } from '../../enums/turn-absolute-name-enum.js';
import {
  RotationDegree,
  RotationDirection,
  RotationDirectionString,
} from '../../enums/movement-enums.js';

type TurnsType = {
  difficultAll: number;
  difficultOrigin: Map<TurnAbsoluteName, number>;
};

type RotationsType = Map<RotationDirectionString, number>;

export class StepCounter {
  private lastStep: Movement | null;
  private turns: TurnsType;
  private rotations: RotationsType;
  private distance: number;

  constructor() {
    this.lastStep = null;
    this.turns = this.initTurns();
    this.rotations = this.initRotations();
    this.distance = 0;
  }

  public update(currentMovement: Movement): void {
    const turnAbsoluteName = currentMovement.absoluteName;

    if (this.conditionIsMovementDifficult(currentMovement)) {
      this.increaseTurnsDifficultAll();
      if (this.conditionToIncreaseDifficultOrigin(turnAbsoluteName)) {
        this.increaseDifficultOrigin(
          turnAbsoluteName,
          this.getCurrentDifficultOriginAmount(turnAbsoluteName)
        );
      }
    }

    if (this.conditionToIncreaseRotations(currentMovement)) {
      this.increaseRotations(currentMovement, this.lastStepRotationDegree);
    }

    this.updateLastStep(currentMovement);
  }

  public get difficultTurnsAllAmount() {
    return this.turns.difficultAll || 0;
  }

  public get difficultTurnsOriginAmount(): number {
    return Array.from(this.turns.difficultOrigin.values()).reduce(
      (a, b) => a + b,
      0
    );
  }

  public get rotationAmount() {
    return {
      clockwise: this.rotations.get(RotationDirectionString.CLOCKWISE) || 0,
      counterclockwise:
        this.rotations.get(RotationDirectionString.COUNTERCLOCKWISE) || 0,
    };
  }

  private conditionToIncreaseRotations(currentMovement: Movement): boolean {
    return (
      currentMovement.rotationDegree >= RotationDegree.DEGREE_360 ||
      (currentMovement.rotationDegree > RotationDegree.DEGREES_0 &&
        currentMovement.rotationDirection === this.lastStep?.rotationDirection)
    );
  }

  private increaseRotations(
    currentMovement: Movement,
    lastStepRotationDegree: number
  ) {
    this.rotations.set(
      this.mappingRotationDirection(currentMovement.rotationDirection),
      currentMovement.rotationDegree + lastStepRotationDegree
    );
  }

  private get lastStepRotationDegree(): number {
    return this.lastStep?.rotationDegree || 0;
  }

  private mappingRotationDirection(
    direction: RotationDirection
  ): RotationDirectionString {
    switch (direction) {
      case RotationDirection.COUNTERCLOCKWISE:
        return RotationDirectionString.COUNTERCLOCKWISE;
      case RotationDirection.CLOCKWISE:
        return RotationDirectionString.CLOCKWISE;
      case RotationDirection.NONE:
        return RotationDirectionString.NONE;
      default:
        throw new Error(
          'from mappingRotationDirection: Unrecognized RotationDirection'
        );
    }
  }

  private conditionIsMovementDifficult(currentMovement: Movement): boolean {
    return currentMovement.isDifficult;
  }

  private conditionToIncreaseDifficultOrigin(
    absoluteName: TurnAbsoluteName
  ): boolean {
    const currentAmount = this.turns.difficultOrigin.get(absoluteName) || 0;
    return currentAmount < 2;
  }

  private increaseTurnsDifficultAll() {
    this.turns.difficultAll += 1;
  }

  private increaseDifficultOrigin(
    absoluteName: TurnAbsoluteName,
    currentDifficultOriginAmount: number
  ) {
    this.turns.difficultOrigin.set(
      absoluteName,
      currentDifficultOriginAmount + 1
    );
  }

  private getCurrentDifficultOriginAmount(absoluteName: TurnAbsoluteName) {
    return this.turns.difficultOrigin.get(absoluteName) || 0;
  }

  private updateLastStep(movement: Movement) {
    this.lastStep = movement;
  }

  private initTurns(): TurnsType {
    return {
      difficultAll: 0,
      difficultOrigin: new Map<TurnAbsoluteName, number>(
        Object.values(TurnAbsoluteName).map((key) => [key, 0])
      ),
    };
  }

  private initRotations(): RotationsType {
    return new Map<RotationDirectionString, number>(
      Object.values(RotationDirectionString).map((key) => [key, 0])
    );
  }
}
