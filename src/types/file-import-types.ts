import * as InkML from '../core/inkml';

export type InkMLFile = {
  id: string;
  fileName: string;
  content?: InkML.Type;
};

export type ImageFile = {
  id: string;
  fileName: string;
  image: string;
};
