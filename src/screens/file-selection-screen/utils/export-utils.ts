import { Pixel } from '../../annotation/image-annotation-screen/types/image-annotation-types';
const cloneDeep = require('clone-deep');

export const createImageExport = (pixels: Pixel[], imageWidth: number) => {
  const res: string[] = [];

  const pixelsCopy = cloneDeep(pixels);
  while (pixelsCopy.length) {
    res.push(
      pixelsCopy
        .splice(0, imageWidth)
        .map(
          (pixel: Pixel) => '{#' + pixel.color + ', ' + pixel.annotation + '}',
        ),
    );
  }
  return res;
};
