import {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useAppSelector} from '../app/hooks';
import {ModeContext} from '../Context/ModeContext';
import {FileType} from '../screens/FileSelectionScreen';
import FileBloc from './FileBloc';
import FileList from './FileList';

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

  if (mode === 'list') {
    const renderItem = () => <FileList />;
    return (
      <View style={styles.files}>
        <FlatList
          data={files.map(data => data.fileName)}
          renderItem={renderItem}
          numColumns={2}
          key={'list'}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        />
      </View>
    );
  } else if (mode === 'block') {
    const renderItem = ({item}) => <FileBloc props={item} />;
    return (
      <View style={styles.files}>
        <FlatList
          data={files.map(data => data.fileName)}
          renderItem={renderItem}
          numColumns={3}
          key={'block'}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        />
      </View>
    );
  } else {
    return <>;</>;
  }
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
