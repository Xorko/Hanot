import * as Data from '../core/data';
import * as InkML from '../core/inkml';
import type {
  Crop,
  Pixel,
} from '../screens/annotation/image-annotation/types/image-annotation-types';
import { Size } from './coordinates-types';

export type AnnotatedImage = {
  id: string;
  imageSource: string;
  imagePixels: Pixel[];
  imageCrops: Crop[];
  imageSize?: Size;
};

export type AnnotatedInkml = {
  id: string;
  content: InkML.Type;
  '?xml'?: Data.XML;
};
