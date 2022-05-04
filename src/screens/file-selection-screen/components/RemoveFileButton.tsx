import { StyleSheet, Text, View } from 'react-native';
import IconButton from '../../../components/IconButton';
import { useFileType } from '../../../context/FileTypeContext';
import { useAppDispatch } from '../../../stores/hooks';
import { useFileSelectionMode } from '../context/FileSelectionModeContext';
import { useSelectedFiles } from '../context/SelectedFilesContext';
import { removeImageFiles, removeTextFiles } from '../loaded-files-slice';

const RemoveFileButton = () => {
  const { selectedFiles, setSelectedFiles } = useSelectedFiles();
  const { fileType } = useFileType();
  const { fileSelectionMode, setFileSelectionMode } = useFileSelectionMode();
  const dispatch = useAppDispatch();

  const handlePress = () => {
    switch (fileType) {
      case 'inkml':
        dispatch(removeTextFiles(selectedFiles));
        break;
      case 'image':
        dispatch(removeImageFiles(selectedFiles));
        break;
      default:
        break;
    }

    setSelectedFiles([]);
    setFileSelectionMode('single');
  };

  return (
    <View style={styles.container}>
      <IconButton
        library="material"
        iconName="close-circle"
        iconSize={60}
        color="danger"
        onPress={handlePress}
        pressable={fileSelectionMode === 'multiple'}
      />
      <Text>Supprimer</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

export default RemoveFileButton;
