import type { ImageFile, InkMLFile } from './file-import-types';
import type { FileType } from './file-types';

export type RootStackParamList = {
  AnnotationScreen: {
    type: FileType;
    file: ImageFile | InkMLFile;
  };
  FileSelectionScreen: {};
};
