import * as Data from '../core/data';
import * as InkML from '../core/inkml';

export type InkMLFile = {
  id: string;
  fileName: string;
  content?: InkML.Type;
  '?xml'?: Data.XML;
};

export type ImageFile = {
  id: string;
  fileName: string;
  image: string;
};
