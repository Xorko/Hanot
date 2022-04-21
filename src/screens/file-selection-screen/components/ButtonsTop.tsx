import { StyleSheet, View } from 'react-native';
import ChangeModeButton from './ChangeModeButton';
import FileTypeChangeButton from './FileTypeChangeButton';
import ImportButton from './ImportButton';

function ButtonsTop() {
  return (
    <View style={styles.container}>
      <View style={styles.ml}>
        <ImportButton />
      </View>
      <View style={styles.mode}>
        <View style={styles.ml}>
          <FileTypeChangeButton />
        </View>
        <View style={styles.ml}>
          <ChangeModeButton />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 40,
    marginTop: 20,
  },
  mode: {
    flexDirection: 'row',
  },
  ml: {
    paddingHorizontal: 20,
  },
});

export default ButtonsTop;
