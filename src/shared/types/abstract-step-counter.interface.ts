import { IMovementExtended } from './extended-movement/movement-extended.interface';

export interface IStepCounter {
  update(movement: IMovementExtended): void;

  reset(): void;
}
