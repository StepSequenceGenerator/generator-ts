import { CoordinatesType } from '../types/coordinates-type';
import { createCoordinates } from '../../modules/sequence-tracker/utils';

/**
 * @param x - длинный борт,
 * @param y - короткий борт;
 * @description точка отсчета - левая сторона, ближайший угол судейского борта
 * */

export const START_COORDINATES: ReadonlyArray<CoordinatesType> = [
  createCoordinates(5, 5),
  createCoordinates(5, 35),
  createCoordinates(55, 5),
  createCoordinates(55, 35),
  createCoordinates(30, 5),
  createCoordinates(30, 35),
  createCoordinates(20, 20),
  createCoordinates(40, 20),
];
