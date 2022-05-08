import { DrawerContentScrollView } from '@react-navigation/drawer';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet } from 'react-native';
import { BlockFileCard } from '../../../components/FileCard';
import { useDrawerFilesContext } from '../../../context/DrawerFilesContext';
import { useAppSelector } from '../../../stores/hooks';
import { ImageFile, InkMLFile } from '../../../types/file-import-types';
import { FileType } from '../../../types/file-types';
import { NavigationProp } from '../../../types/navigation-types';
import { LoadedFilesState } from '../../file-selection-screen/loaded-files-slice';

type CustomDrawerContentProps = {
  fileType: FileType;
  [key: string]: any;
};

function CustomDrawerContent({ fileType, ...props }: CustomDrawerContentProps) {
  const navigation = useNavigation<NavigationProp>();
  const { openedFiles: openedFilesIds } = useDrawerFilesContext();
  const files = useAppSelector(
    (state: { loadedFiles: LoadedFilesState }) =>
      (fileType === 'inkml'
        ? state.loadedFiles.textFileInfo
        : state.loadedFiles.imageFileInfo) as (InkMLFile | ImageFile)[],
  ).filter(file => openedFilesIds?.some(id => id === file.id));

  const annotatedOpenedFiles = useAppSelector(
    state =>
      (fileType === 'inkml'
        ? state.annotatedInkml.annotatedInkml
        : state.annotatedImages.annotatedImages) as (InkMLFile | ImageFile)[],
  );

  const handlePress = (file: InkMLFile | ImageFile) => {
    navigation.dispatch(DrawerActions.closeDrawer()); // Force close drawer before navigating ohterwise it can be a bit buggy

    switch (fileType) {
      case 'image':
        navigation.navigate('AnnotationScreen', {
          screen: 'Annotation',
          params: {
            type: fileType,
            file,
          },
        });
        break;
      case 'inkml':
        navigation.navigate('AnnotationScreen', {
          screen: 'Annotation',
          params: {
            type: fileType,
            file,
          },
        });
        break;
    }
  };

  const fileIsAnnotated = (file: InkMLFile | ImageFile) => {
    return annotatedOpenedFiles.some(
      annotatedFile => annotatedFile.id === file.id,
    );
  };

  return (
    <DrawerContentScrollView style={styles.container} {...props}>
      {files.map(file => (
        <Pressable key={file.id} onPress={() => handlePress(file)}>
          <BlockFileCard file={file} isAnnotated={fileIsAnnotated(file)} />
        </Pressable>
      ))}
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CustomDrawerContent;
