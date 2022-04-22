import { StyleSheet, View } from 'react-native';
import { useAppSelector } from '../../../stores/hooks';
import { useFileSelectionMode } from '../context/FileSelectionModeContext';
import { useFileType } from '../context/FileTypeContext';
import { useSelectedFiles } from '../context/SelectedFilesContext';
import ChangeModeButton from './ChangeModeButton';
import FileTypeChangeButton from './FileTypeChangeButton';
import FullSelectionButton from './FullSelectionButton';
import ImportButton from './ImportButton';

function ButtonsTop() {
  const { setSelectedFiles } = useSelectedFiles();
  const { fileType } = useFileType();
  const loadedFiles = useAppSelector(state => state.loadedFiles);
  const { fileSelectionMode, setFileSelectionMode } = useFileSelectionMode();

  // set the list of selected files to empty
  const cancelPress = () => {
    setSelectedFiles([]);
    setFileSelectionMode('single');
  };

  // add all inkml|image files to the list of selected filesi
  const fullSelectionPress = () => {
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
      <View style={styles.pl}>
        <ImportButton />
      </View>
      <View style={styles.mode}>
        <View style={styles.jc}>
          {fileSelectionMode === 'multiple' ? (
            <FullSelectionButton
              show={true}
              buttonText="Annuler"
              onPress={cancelPress}
            />
          ) : null}
        </View>
        <View style={styles.jc}>
          <FullSelectionButton
            show={true}
            buttonText="Tout sélectionner"
            onPress={() => fullSelectionPress()}
          />
        </View>
        <View style={styles.pl}>
          <FileTypeChangeButton />
        </View>
        <View style={styles.pl}>
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
  mode: {
    flexDirection: 'row',
  },
  pl: {
    paddingHorizontal: 20,
  },
  jc: {
    justifyContent: 'center',
    marginHorizontal: 10,
  },
});

export default ButtonsTop;
