import {useState} from 'react';
import {Button, Dimensions, StyleSheet, View} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import Files from '../Components_remake/Files';
import HeaderFiles from '../Components_remake/HeaderFiles';
import SideBar from '../Components_remake/SideBar';
import {DisplayMode, ModeContext} from '../Context/ModeContext';
import {handleOpenFiles} from '../utils/file-utils';

const windowWidth = Dimensions.get('window').width;

function FileSelectionScreen() {
  const [mode, setMode] = useState<DisplayMode>('block');
  const [filesInfo, setFilesInfo] = useState<Array<any>>(Array);

  const changeFilesInfo = (data: any) => setFilesInfo(filesInfo.concat(data));
  const changeDisplayMode = (newMode: DisplayMode) => setMode(newMode);

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
            <Files files={filesInfo} />
            <Button
              title="pick files"
              onPress={() => {
                handleOpenFiles()
                  .then(data => changeFilesInfo(data))
                  .catch(err => console.log(err));
              }}
            />
            <Button
              title="show files"
              onPress={() => filesInfo.map((s: any) => console.log(s.fileName))}
            />
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
export default FileSelectionScreen;
