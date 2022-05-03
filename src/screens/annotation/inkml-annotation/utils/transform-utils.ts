import { getExtremePointsOfPath } from '../../image-annotation/utils/crop-utils';
import { Coordinates, Size } from '../../types/coordinates-types';
import { Transform } from '../types/annotation-types';

export const getTransform = (coordinates: Coordinates[], areaSize: Size) => {
  const { minX, minY, maxX, maxY } = getExtremePointsOfPath(coordinates);

  const wordWidth = maxX - minX;
  const wordHeight = maxY - minY;

  const scale = Math.min(
    areaSize.width / (wordWidth + 5),
    areaSize.height / (wordHeight + 5),
  );

  const widthDiff = (areaSize.width - wordWidth * scale) / 6;
  const heightDiff = (areaSize.height - wordHeight * scale) / 6;

  return {
    translateX: widthDiff > 0 ? minX - widthDiff : minX,
    translateY: heightDiff > 0 ? minY - heightDiff : minY,
    scale,
  };
};

export const reverseTransform = (
  coordinates: Coordinates,
  transform: Transform,
) => ({
  x: coordinates.x / transform.scale + transform.translateX,
  y: coordinates.y / transform.scale + transform.translateY,
});
