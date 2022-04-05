import {useState} from 'react';
import {Button, Dimensions, StyleSheet, View} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import Files from '../Components_remake/Files';
import HeaderFiles from '../Components_remake/HeaderFiles';
import SideBar from '../Components_remake/SideBar';
import {DisplayMode, ModeContext} from '../Context/ModeContext';
import {addImageFile, addTextFile} from '../features/files/loaded-files-slice';
import {handleOpenImageFiles, handleOpenInkmlFiles} from '../utils/file-utils';

const windowWidth = Dimensions.get('window').width;

export type FileType = 'image' | 'inkml';

function TextFileSelectionScreen() {
  const [mode, setMode] = useState<DisplayMode>('block');
  const [type, setType] = useState<FileType>('inkml');

  const textFiles = useAppSelector(state =>
    type === 'inkml'
      ? state.loadedFiles.textFileInfo
      : state.loadedFiles.imageFileInfo,
  );
  const dispatch = useAppDispatch();

  const changeDisplayMode = (newMode: DisplayMode) => setMode(newMode);

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
      <Shadow containerViewStyle={{alignSelf: 'flex-end'}}>
        <View style={styles.annotation}>
          <ModeContext.Provider
            value={{
              mode: mode,
              changeMode: changeDisplayMode,
            }}>
            <HeaderFiles />
            <Files type={type} />
            <Button title="pick files" onPress={handleFileSelection} />
            <Button
              title="show files"
              onPress={() => textFiles.map((s: any) => console.log(s.fileName))}
            />
            <Button title={buttonTitle} onPress={handleFileTypeChange} />
          </ModeContext.Provider>
        </View>
      </Shadow>
    </View>
  );
}

const styles = StyleSheet.create({
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
