import {ImageFile, InkMLFile} from './file-import-types';

export type RootStackParamList = {
  ImageAnnotationScreen: {file: ImageFile};
  InkMLAnnotationScreen: {file: InkMLFile};
  FileSelectionScreen: {};
};
