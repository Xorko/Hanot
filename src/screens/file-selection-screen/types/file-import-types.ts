import * as InkML from '../../../core/inkml';

export type InkMLFile = {
  fileName: string;
  filePath: string;
  content?: InkML.Type;
};

export type ImageFile = {
  fileName: string;
  filePath: string;
  image: string;
};
