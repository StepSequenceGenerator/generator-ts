import { IMovementExtended } from './movement-extended.interface';

export interface IStepCounter {
  update(movement: IMovementExtended): void;

  reset(): void;
}
