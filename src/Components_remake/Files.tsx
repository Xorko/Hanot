import {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import uuid from 'react-native-uuid';
import {ModeContext} from '../Context/ModeContext';
import FileBloc from './FileBloc';
import FileList from './FileList';

type FilesProps = {
  files: any[];
};

function Files({files}: FilesProps) {
  const {mode} = useContext(ModeContext);
  files.map(data => {
    if (a.indexOf(data.fileName) === -1) {
      a.push(data.fileName);
      console.log('im in if ' + data.fileName);
    }
  });
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
    const renderItem = ({item}) => <FileBloc props={item} />;
    return (
      <View style={styles.files}>
        <FlatList
          data={a}
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

let a: any = [];

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
