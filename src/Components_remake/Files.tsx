import {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useAppSelector} from '../app/hooks';
import {FileTypeContext} from '../Context/FileTypeContext';
import {ModeContext} from '../Context/ModeContext';
import File from './File';

function Files() {
  const {mode} = useContext(ModeContext);
  const {type} = useContext(FileTypeContext);

  const files = useAppSelector((state: any) =>
    type === 'inkml'
      ? state.loadedFiles.textFileInfo
      : state.loadedFiles.imageFileInfo,
  );

  return (
    <View style={styles.files}>
      <FlatList
        data={files}
        renderItem={({item}) => <File file={item} />}
        numColumns={mode === 'block' ? 3 : 2}
        key={mode}
        contentContainerStyle={styles.container}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  files: {
    flex: 1,
    height: '100%',
    width: '100%',
    padding: 30,
  },
  scroll: {
    backgroundColor: '#e1e2e1',
    flexGrow: 1,
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});
export default Files;
