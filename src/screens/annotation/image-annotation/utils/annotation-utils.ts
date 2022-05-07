import { AnnotatedImage } from '../../../../types/annotated-files-types';
import { Coordinates, Size } from '../../../../types/coordinates-types';
import { Pixel } from '../types/image-annotation-types';
import { getAllPointsInPath } from './pixels-utils';

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

export const makeAnnotation = (
  image: AnnotatedImage,
  cropPaths: Coordinates[][],
  imageWidth: number,
) => {
  const pixels = image.imagePixels;

  // Map that counts the letters occurences
  const lettersMap: Map<string, number> = new Map();

  cropPaths.forEach((path: Coordinates[], idx: number) => {
    // For every crop, gets the crop annotation
    const annotation = image.imageCrops[idx].cropAnnotation;

    // Updates the letters map with the crop annotation
    if (annotation) {
      const letterOccurences = lettersMap.get(annotation);
      lettersMap.set(annotation, letterOccurences ? letterOccurences + 1 : 1);
    }

    // Then gets all points that are on and in the path
    getAllPointsInPath(path, imageWidth).forEach((index: number) => {
      // For every point, sets the annotation of the corresponding pixel to the one of the crop, if the pixel is not white (background)
      const pixel: Pixel = pixels[index];
      // If the pixel is not white (background)
      if (pixel.color !== '#FFFFFF') {
        if (annotation) {
          // If the crop has an annotation, annotates the pixel with the annotation and the occurence of the annotation
          const occ = lettersMap.get(annotation);
          pixel.annotation = `${annotation}-${occ}`;
        } else {
          // If the crop has no annotation, the annotation will be considered to be undefined
          pixel.annotation = 'undefined';
        }
      }
    });
  });
  return pixels;
};
