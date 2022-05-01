import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import IconButton from '../../../components/IconButton';
import { useDrawerFilesContext } from '../../../context/DrawerFilesContext';
import { useAppSelector } from '../../../stores/hooks';
import { NavigationProp } from '../../../types/navigation-types';
import { resetCurrentAnnotatedImage } from '../../annotation/image-annotation-screen/current-annotated-image';
import { useFileSelectionMode } from '../context/FileSelectionModeContext';
import { useFileType } from '../context/FileTypeContext';
import { useSelectedFiles } from '../context/SelectedFilesContext';
import { LoadedFilesState } from '../loaded-files-slice';

const OpenFileButton = () => {
  const navigation = useNavigation<NavigationProp>();
  const { setFileSelectionMode } = useFileSelectionMode();
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
    <IconButton
      library="material"
      iconName="pencil-circle"
      color="dark"
      onPress={handlePress}
    />
  );
};

export default OpenFileButton;
