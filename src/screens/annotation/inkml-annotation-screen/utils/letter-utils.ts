/**
 * @param coords list of x points
 * @returns max value in entry
 */
export const getMaxValue = (coords: number[]) => {
  return Math.max.apply(null, coords);
};

/**
 * @param coords list of points
 * @returns min value in entry
 */
export const getMinValue = (coords: number[]) => {
  return Math.min.apply(null, coords);
};
