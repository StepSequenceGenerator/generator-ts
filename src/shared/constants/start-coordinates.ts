import { DescartesCoordinatesType } from '../types/descartes-coordinates.type';
import { createCoordinates } from '../../modules/sequence-tracker/utils';

/**
 * @param x - длинный борт,
 * @param y - короткий борт;
 * @description точка отсчета - левая сторона, ближайший угол судейского борта
 * */

export const START_COORDINATES: ReadonlyArray<DescartesCoordinatesType> = [
  createCoordinates(5, 5),
  createCoordinates(5, 25),
  createCoordinates(55, 5),
  createCoordinates(55, 25),
  createCoordinates(30, 5),
  createCoordinates(30, 25),
  createCoordinates(20, 15),
  createCoordinates(40, 15),
];
