import { DrawerNavigationProp } from '@react-navigation/drawer';
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { ImageFile, InkMLFile } from './file-import-types';
import type { FileType } from './file-types';

export type RootStackParamList = {
  AnnotationScreen: NavigatorScreenParams<DrawerParamList>;
  FileSelectionScreen: {};
};

export type DrawerParamList = {
  Annotation: {
    type: FileType;
    file: ImageFile | InkMLFile;
  };
};

export type NavigationProp = CompositeNavigationProp<
  DrawerNavigationProp<DrawerParamList, 'Annotation'>,
  StackNavigationProp<RootStackParamList>
>;
