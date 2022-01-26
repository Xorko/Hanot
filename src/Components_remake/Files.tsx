import {StyleSheet, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import File from './File';

function Files() {
  const renderItem = () => <File />;
  return (
    <View style={styles.files}>
      <FlatList
        data={a}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      />
    </View>
  );
}

const a = [File, File, File, File, File, File, File, File, File];
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
