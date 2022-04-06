import {useContext} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useAppSelector} from '../app/hooks';
import {ModeContext} from '../Context/ModeContext';
import {FileType} from '../screens/FileSelectionScreen';
import File from './File';
interface FilesPropsType {
  type: FileType;
}

function Files({type}: FilesPropsType) {
  const {mode} = useContext(ModeContext);

  const files = useAppSelector(state =>
    type === 'inkml'
      ? state.loadedFiles.textFileInfo
      : state.loadedFiles.imageFileInfo,
  );

  const containerStyle: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  };

  return (
    <View style={styles.files}>
      <FlatList
        data={files.map(data => data.fileName)}
        renderItem={({item}) => <File fileName={item} />}
        numColumns={mode === 'block' ? 3 : 2}
        key={mode}
        contentContainerStyle={containerStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
