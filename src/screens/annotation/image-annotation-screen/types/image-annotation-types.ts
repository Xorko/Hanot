export type Point = {
  x: number;
  y: number;
};

export type Pixel = {
  color: string;
  annotation?: string;
};

export type Crop = {
  cropPath: Point[];
  cropAnnotation?: string;
};

export type Size = {
  width: number;
  height: number;
};
