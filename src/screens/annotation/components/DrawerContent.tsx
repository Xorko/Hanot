import { DrawerContentScrollView } from '@react-navigation/drawer';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet } from 'react-native';
import { useDrawerFilesContext } from '../../../context/DrawerFilesContext';
import { useAppDispatch, useAppSelector } from '../../../stores/hooks';
import { ImageFile, InkMLFile } from '../../../types/file-import-types';
import { FileType } from '../../../types/file-types';
import { NavigationProp } from '../../../types/navigation-types';
import { BlockFile } from '../../file-selection-screen/components/FileCard';
import { LoadedFilesState } from '../../file-selection-screen/loaded-files-slice';
import { resetCurrentAnnotatedImage } from '../image-annotation/current-annotated-image';

type CustomDrawerContentProps = {
  fileType: FileType;
  [key: string]: any;
};

function CustomDrawerContent({ fileType, ...props }: CustomDrawerContentProps) {
  const navigation = useNavigation<NavigationProp>();
  const { openedFiles: openedFilesIds } = useDrawerFilesContext();
  const dispatch = useAppDispatch();
  const files = useAppSelector(
    (state: { loadedFiles: LoadedFilesState }) =>
      (fileType === 'inkml'
        ? state.loadedFiles.textFileInfo
        : state.loadedFiles.imageFileInfo) as (InkMLFile | ImageFile)[],
  ).filter(file => openedFilesIds?.some(id => id === file.id));

  const handlePress = (file: InkMLFile | ImageFile) => {
    navigation.dispatch(DrawerActions.closeDrawer()); // Force close drawer before navigating ohterwise it can be a bit buggy

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

  return (
    <DrawerContentScrollView style={styles.container} {...props}>
      {files.map(file => (
        <Pressable key={file.id} onPress={() => handlePress(file)}>
          <BlockFile file={file} />
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
