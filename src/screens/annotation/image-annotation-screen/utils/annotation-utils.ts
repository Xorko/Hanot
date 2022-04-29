import { Point, Size } from '../types/image-annotation-types';

/**
 * Calculates the paths adjusted to the real image size
 * @returns The paths adjusted to the real image size
 */
export const getAdjustedPaths = (
  trueSize: Size,
  displayedSize: Size,
  paths: Point[][],
) => {
  if (trueSize && displayedSize) {
    const widthRatio = trueSize.width / displayedSize.width;
    const heightRatio = trueSize.height / displayedSize.height;

    return paths.map((path: Point[]) => {
      return path.map((point: Point) => {
        return {
          x: point.x * widthRatio,
          y: point.y * heightRatio,
        };
      });
    });
  }
};
