import { Size } from '../types/coordinates-types';

/**
 * Adapts the image size to its container.
 * @param containerSize Size of the container
 * @param imageSize Size of the image
 * @returns The size for the image to fit in the container
 */
export const getAdaptedImageSize = (
  containerSize: Size,
  imageSize: Size,
): Size => {
  const { width, height } = containerSize;

  // The size scale between the container and the image
  const scale = Math.min(width / imageSize.width, height / imageSize.height);

  /*
    If the image is smaller than the container, the displayed size is the true size
    Else the displayed size is the size scaled to the container
  */
  return {
    width: imageSize.width * (scale < 1 ? scale : 1),
    height: imageSize.height * (scale < 1 ? scale : 1),
  };
};
