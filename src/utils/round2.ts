/**
 * округляет до второго знака после запятой
 * */
export const round2 = (value: number): number => {
  return Math.round(value * 100) / 100;
};
