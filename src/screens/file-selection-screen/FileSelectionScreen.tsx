import {useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Files from './components/Files';
import Buttons from './components/Buttons';
import {FileType, FileTypeContext} from './context/FileTypeContext';
import {DisplayMode, ModeContext} from './context/ModeContext';

const windowWidth = Dimensions.get('window').width;

function TextFileSelectionScreen() {
  const [mode, setMode] = useState<DisplayMode>('block');
  const [type, setType] = useState<FileType>('inkml');

  const changeDisplayMode = (newMode: DisplayMode) => setMode(newMode);

  const changeType = () => {
    type === 'inkml' ? setType('image') : setType('inkml');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.annotation}>
        <ModeContext.Provider
          value={{
            mode: mode,
            changeMode: changeDisplayMode,
          }}>
          <FileTypeContext.Provider
            value={{type: type, changeType: changeType}}>
            <Buttons />
            <Files />
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
