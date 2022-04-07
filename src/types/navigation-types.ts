import {ImageFile, InkMLFile} from './types';

export type RootStackParamList = {
  ImageAnnotationScreen: {file: ImageFile};
  InkMLAnnotationScreen: {file: InkMLFile};
  FileSelectionScreen: {};
};
