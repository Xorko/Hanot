import type { Pixel, Crop } from './image-annotation-types';

export type annotatedImage = {
  filePath: string;
  imageSource: string;
  imagePixels: Pixel[];
  imageCrops: Crop[];
  imageWidth: number;
};
