import { useNavigation } from '@react-navigation/native';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { BlockFileCard } from '../../../components/FileCard';
import { useDrawerFilesContext } from '../../../context/DrawerFilesContext';
import { useAppDispatch, useAppSelector } from '../../../stores/hooks';
import { ImageFile, InkMLFile } from '../../../types/file-import-types';
import { FileType } from '../../../types/file-types';
import { NavigationProp } from '../../../types/navigation-types';
import { LoadedFilesState } from '../../file-selection-screen/loaded-files-slice';
import { useWebDrawer } from '../context/WebDrawerContext';
import { resetCurrentAnnotatedImage } from '../image-annotation/current-annotated-image';

type WebDrawerContentProps = {
  fileType: FileType;
};

function WebDrawerContent({ fileType }: WebDrawerContentProps) {
  const navigation = useNavigation<NavigationProp>();
  const { closeWebDrawer } = useWebDrawer();
  const { openedFiles: openedFilesIds } = useDrawerFilesContext();
  const dispatch = useAppDispatch();
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
    closeWebDrawer();

    switch (fileType) {
      case 'image':
        dispatch(resetCurrentAnnotatedImage());
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

  /*
   * The scrollview below doesn't do any scrolling (probably because of the drawer base style).
   * The scrolling is working with the patch of react-modern-drawer
   */
  return (
    <ScrollView style={styles.container}>
      {files.map(file => (
        <Pressable key={file.id} onPress={() => handlePress(file)}>
          <BlockFileCard file={file} isAnnotated={fileIsAnnotated(file)} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WebDrawerContent;
