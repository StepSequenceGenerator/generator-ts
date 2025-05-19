import { IStepCounter } from '../../shared/types/abstract-step-counter.interface';
import { IMovementExtended } from '../../shared/types/extended-movement/movement-extended.interface';
import { TurnAbsoluteName } from '../../shared/enums/turn-absolute-name-enum';

export class ThreeDifficultTurnsBlockCounter implements IStepCounter {
  private blockAmount: number;
  private turns: Map<TurnAbsoluteName, number>;

  constructor() {
    this.blockAmount = 0;
    this.turns = this.initTurns();
  }

  private initTurns() {
    const keys = Object.values(TurnAbsoluteName).filter(
      (name: TurnAbsoluteName) =>
        ![TurnAbsoluteName.CHOCTAW, TurnAbsoluteName.UNKNOWN].includes(name),
    );
    return new Map<TurnAbsoluteName, number>(keys.map((key) => [key, 0]));
  }

  public update(movement: IMovementExtended): void {
    const turnName = movement.absoluteName;
    const currentCount = this.turns.get(turnName);
    const oneTypeTurnMaxAmount = this.getOneTypeTurnMaxAmount();
    if (currentCount !== undefined && currentCount < oneTypeTurnMaxAmount) {
      this.turns.set(turnName, currentCount + 1);
    }
  }

  private getOneTypeTurnMaxAmount() {
    const values = Array.from(this.turns.values());
    return values.includes(2) ? 1 : 2;
  }

  public increaseAmount(): void {
    this.blockAmount += 1;
  }

  public reset() {
    this.resetAmount();
    this.resetTurns();
  }

  public resetAmount() {
    this.blockAmount = 0;
  }

  public resetTurns() {
    this.turns = this.initTurns();
  }

  get amount(): number {
    return this.blockAmount;
  }

  set amount(amount: number) {
    this.blockAmount = amount;
  }
}
