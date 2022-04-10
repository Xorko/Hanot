import type {Pixel, Crop} from './image-annotation-types';

export type annotatedImage = {
  imageSource: string;
  imagePixels: Pixel[];
  imageCrops: Crop[];
};
