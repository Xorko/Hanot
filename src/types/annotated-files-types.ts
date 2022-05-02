import * as InkML from '../core/inkml';
import type {
  Crop,
  Pixel,
} from '../screens/annotation/image-annotation-screen/types/image-annotation-types';

export type AnnotatedImage = {
  id: string;
  imageSource: string;
  imagePixels: Pixel[];
  imageCrops: Crop[];
  imageWidth: number;
};

export type AnnotatedInkml = {
  id: string;
  content: InkML.Type;
};
