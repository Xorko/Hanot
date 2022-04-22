import { StyleSheet, View } from 'react-native';
import Button from '../../../components/Button';
import { useAppSelector } from '../../../stores/hooks';
import { useFileSelectionMode } from '../context/FileSelectionModeContext';
import { useFileType } from '../context/FileTypeContext';
import { useSelectedFiles } from '../context/SelectedFilesContext';
import ChangeModeButton from './ChangeModeButton';
import FileTypeChangeButton from './FileTypeChangeButton';
import ImportButton from './ImportButton';

function ButtonsTop() {
  const { setSelectedFiles } = useSelectedFiles();
  const { fileType } = useFileType();
  const loadedFiles = useAppSelector(state => state.loadedFiles);
  const { fileSelectionMode, setFileSelectionMode } = useFileSelectionMode();

  /**
   * Removes all selected files from the context and UI.
   */
  const handleCancelSelectionButtonPress = () => {
    setSelectedFiles([]);
    setFileSelectionMode('single');
  };

  /**
   * Selects all files of the current file type.
   */
  const handleSelectAllPress = () => {
    setFileSelectionMode('multiple');
    switch (fileType) {
      case 'inkml':
        const inkmlToSelect = loadedFiles.textFileInfo.map(file => {
          return { fileName: file.fileName, filePath: file.filePath, type: fileType };
        });
        setSelectedFiles(inkmlToSelect);
        break;
      case 'image':
        const imagesToSelect = loadedFiles.imageFileInfo.map(file => {
          return { fileName: file.fileName, filePath: file.filePath, type: fileType };
        });
        setSelectedFiles(imagesToSelect);
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.px}>
        <ImportButton />
      </View>
      <View style={styles.mode}>
        <View style={styles.selectionButton}>
          {fileSelectionMode === 'multiple' && (
            <Button
              variant="dark"
              title="Annuler la sélection"
              onPress={handleCancelSelectionButtonPress}
            />
          )}
        </View>
        <View style={styles.selectionButton}>
          <Button
            variant="dark"
            title="Tout sélectionner"
            onPress={() => handleSelectAllPress()}
          />
        </View>
        <View style={styles.px}>
          <FileTypeChangeButton />
        </View>
        <View style={styles.px}>
          <ChangeModeButton />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 20,
  },
  selectionButton: {
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  mode: {
    flexDirection: 'row',
  },
  px: {
    paddingHorizontal: 20,
  },
});

export default ButtonsTop;
