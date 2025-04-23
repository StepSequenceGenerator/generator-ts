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

type ThreeTurnsBlockType = {
  blockAmount: number;
  turns: Map<TurnAbsoluteName, number>;
};

type RotationsType = Map<RotationDirectionString, number>;

export class StepCounter {
  private lastStep: Movement | null;
  private turns: TurnsType;
  private rotations: RotationsType;
  private threeTurnsBlock: ThreeTurnsBlockType;

  private distance: number;

  constructor() {
    this.lastStep = null;
    this.turns = this.initTurns();
    this.rotations = this.initRotations();
    this.distance = 0;
    this.threeTurnsBlock = this.initThreeTurnsBlock();
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

  public increaseThreeTurnsBlockAmount() {
    this.threeTurnsBlock.blockAmount++;
  }

  public updateThreeTurnsBlockOrigin(turnName: TurnAbsoluteName) {
    const { turns } = this.threeTurnsBlock;
    const currentCount = turns.get(turnName);
    const oneTypeTurnMaxAmount = this.getOneTypeTurnMaxAmount();
    if (currentCount !== undefined && currentCount < oneTypeTurnMaxAmount) {
      turns.set(turnName, currentCount + 1);
    }
  }

  public get unusedDifficultTurns(): TurnAbsoluteName[] {
    const { turns } = this.threeTurnsBlock;

    const oneTypeTurnMaxAmount = this.getOneTypeTurnMaxAmount();
    return Array.from(turns.entries())
      .filter(([, amount]) => amount < oneTypeTurnMaxAmount)
      .map(([name]) => name);
  }

  private getOneTypeTurnMaxAmount() {
    const values = Array.from(this.threeTurnsBlock.turns.values());
    return values.includes(2) ? 1 : 2;
  }

  public get threeTurnsBlockAmount() {
    return this.threeTurnsBlock.blockAmount;
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

  private initThreeTurnsBlock(): ThreeTurnsBlockType {
    const keys = Object.values(TurnAbsoluteName).filter(
      (name) =>
        ![TurnAbsoluteName.CHOCTAW, TurnAbsoluteName.UNKNOWN].includes(name)
    );
    return {
      blockAmount: 0,
      turns: new Map(keys.map((key) => [key, 0])),
    };
  }

  private initRotations(): RotationsType {
    return new Map<RotationDirectionString, number>(
      Object.values(RotationDirectionString).map((key) => [key, 0])
    );
  }
}
