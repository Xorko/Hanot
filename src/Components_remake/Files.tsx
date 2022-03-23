import {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import uuid from 'react-native-uuid';
import {ModeContext} from '../Context/ModeContext';
import FileBloc from './FileBloc';
import FileList from './FileList';

function Files() {
  const {mode} = useContext(ModeContext);

  if (mode === 'list') {
    const renderItem = () => <FileList />;
    return (
      <View style={styles.files}>
        <FlatList
          data={a}
          renderItem={renderItem}
          numColumns={2}
          key={'list'}
          keyExtractor={() => uuid.v4() as string}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        />
      </View>
    );
  } else if (mode === 'block') {
    const renderItem = () => <FileBloc />;
    return (
      <View style={styles.files}>
        <FlatList
          data={b}
          renderItem={renderItem}
          numColumns={3}
          key={'block'}
          keyExtractor={() => uuid.v4() as string}
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

const a = [
  FileList,
  FileList,
  FileList,
  FileList,
  FileList,
  FileList,
  FileList,
  FileList,
  FileList,
];
const b = [
  FileBloc,
  FileBloc,
  FileBloc,
  FileBloc,
  FileBloc,
  FileBloc,
  FileBloc,
  FileBloc,
  FileBloc,
];
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
