import { Coordinates } from '../../types/coordinates-types';

export type Pixel = {
  color: string;
  annotation?: string;
};

export type Crop = {
  cropPath: Coordinates[];
  cropAnnotation?: string;
};

export type Size = {
  width: number;
  height: number;
};
