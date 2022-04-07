import {useState} from 'react';
import {Button, Dimensions, StyleSheet, View} from 'react-native';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import Files from '../Components_remake/Files';
import HeaderFiles from '../Components_remake/HeaderFiles';
import SideBar from '../Components_remake/SideBar';
import {FileType, FileTypeContext} from '../Context/FileTypeContext';
import {DisplayMode, ModeContext} from '../Context/ModeContext';
import {
  addImageFile,
  addTextFile,
  LoadedFilesState,
} from '../features/files/loaded-files-slice';
import {handleOpenImageFiles, handleOpenInkmlFiles} from '../utils/file-utils';

const windowWidth = Dimensions.get('window').width;

function TextFileSelectionScreen() {
  const [mode, setMode] = useState<DisplayMode>('block');
  const [type, setType] = useState<FileType>('inkml');

  const textFiles = useAppSelector((state: {loadedFiles: LoadedFilesState}) =>
    type === 'inkml'
      ? state.loadedFiles.textFileInfo
      : state.loadedFiles.imageFileInfo,
  );
  const dispatch = useAppDispatch();

  const changeDisplayMode = (newMode: DisplayMode) => setMode(newMode);

  const changeType = () => {
    type === 'inkml' ? setType('image') : setType('inkml');
  };

  const addFiles = (fileInfo: any[]) => {
    switch (type) {
      case 'image':
        dispatch(addImageFile(fileInfo));
        break;
      case 'inkml':
        dispatch(addTextFile(fileInfo));
        break;
    }
  };

  const handleFileTypeChange = () => {
    switch (type) {
      case 'image':
        setType('inkml');
        break;
      case 'inkml':
        setType('image');
        break;
    }
  };

  const handleFileSelection = () => {
    switch (type) {
      case 'image':
        handleOpenImageFiles().then(addFiles);
        break;
      case 'inkml':
        handleOpenInkmlFiles().then(addFiles);
        break;
    }
  };

  const buttonTitle: string =
    type === 'inkml' ? 'Change to Image' : 'Change to InkML';

  return (
    <View style={styles.screen}>
      <SideBar />
      <View style={styles.annotation}>
        <ModeContext.Provider
          value={{
            mode: mode,
            changeMode: changeDisplayMode,
          }}>
          <FileTypeContext.Provider
            value={{type: type, changeType: changeType}}>
            <HeaderFiles />
            <Files />
            <Button title="pick files" onPress={handleFileSelection} />
            <Button
              title="show files"
              onPress={() => textFiles.map((s: any) => console.log(s.fileName))}
            />
            <Button title={buttonTitle} onPress={handleFileTypeChange} />
          </FileTypeContext.Provider>
        </ModeContext.Provider>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
  },
  screen: {
    height: '100%',
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  annotation: {
    flex: 1,
    width: windowWidth / 1.07,
    backgroundColor: '#e1e2e1',
    padding: '5%',
    justifyContent: 'flex-start',
    borderRadius: 40,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
});
/*

type FileSelectionScreenProps = DrawerScreenProps<
  DrawerParamList,
  'File Selection'
>;
function FileSelectionScreen({navigation}: FileSelectionScreenProps) {
  return (
    <View style={styles.center}>
      <Button onPress={() => navigation.goBack()} title="Go back" />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
*/
export default TextFileSelectionScreen;
