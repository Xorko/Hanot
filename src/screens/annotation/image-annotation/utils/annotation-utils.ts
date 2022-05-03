import { Coordinates, Size } from '../../types/coordinates-types';

/**
 * Calculates the paths adjusted to the real image size
 * @returns The paths adjusted to the real image size
 */
export const getAdjustedPaths = (
  trueSize: Size,
  displayedSize: Size,
  paths: Coordinates[][],
) => {
  if (trueSize && displayedSize) {
    const widthRatio = trueSize.width / displayedSize.width;
    const heightRatio = trueSize.height / displayedSize.height;

    return paths.map((path: Coordinates[]) => {
      return path.map((point: Coordinates) => {
        return {
          x: point.x * widthRatio,
          y: point.y * heightRatio,
        };
      });
    });
  }
};
