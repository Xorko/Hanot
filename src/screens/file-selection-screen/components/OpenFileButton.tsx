import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import IconButton from '../../../components/IconButton';
import Text from '../../../components/Text';
import { useDrawerFilesContext } from '../../../context/DrawerFilesContext';
import { useFileType } from '../../../context/FileTypeContext';
import { useAppSelector } from '../../../stores/hooks';
import { NavigationProp } from '../../../types/navigation-types';
import { resetCurrentAnnotatedImage } from '../../annotation/image-annotation/current-annotated-image';
import { useFileSelectionMode } from '../context/FileSelectionModeContext';
import { useSelectedFiles } from '../context/SelectedFilesContext';
import { LoadedFilesState } from '../loaded-files-slice';

const OpenFileButton = () => {
  const navigation = useNavigation<NavigationProp>();
  const { fileSelectionMode, setFileSelectionMode } = useFileSelectionMode();
  const { selectedFiles, setSelectedFiles } = useSelectedFiles();
  const { setOpenedFiles } = useDrawerFilesContext();
  const { fileType } = useFileType();
  const dispatch = useDispatch();
  const files = useAppSelector((state: { loadedFiles: LoadedFilesState }) =>
    fileType === 'inkml'
      ? state.loadedFiles.textFileInfo
      : state.loadedFiles.imageFileInfo,
  );

  const handlePress = () => {
    if (!(fileSelectionMode === 'multiple')) {
      return;
    }
    if (selectedFiles) {
      setOpenedFiles(selectedFiles.map(file => file.id));
      setSelectedFiles([]);
      setFileSelectionMode('single');

      const indexOfFirstFile = files.findIndex(
        file => file.id === selectedFiles[0].id,
      );

      switch (fileType) {
        case 'image':
          dispatch(resetCurrentAnnotatedImage());
          navigation.navigate('AnnotationScreen', {
            screen: 'Annotation',
            params: {
              type: fileType,
              file: files[indexOfFirstFile],
            },
          });
          break;
        case 'inkml':
          navigation.navigate('AnnotationScreen', {
            screen: 'Annotation',
            params: {
              type: fileType,
              file: files[indexOfFirstFile],
            },
          });
          break;
      }
    }
  };

  return (
    <View style={styles.container}>
      <IconButton
        library="material"
        iconName="pencil-circle"
        iconSize={60}
        color="warning"
        onPress={handlePress}
        pressable={fileSelectionMode === 'multiple'}
      />
      <Text variant="dark">Ouvrir</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

export default OpenFileButton;
