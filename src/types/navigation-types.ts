import {
  ImageFile,
  InkMLFile,
} from '../screens/file-selection-screen/types/file-import-types';

export type RootStackParamList = {
  ImageAnnotationScreen: { file: ImageFile };
  InkMLAnnotationScreen: { file: InkMLFile };
  FileSelectionScreen: {};
};
