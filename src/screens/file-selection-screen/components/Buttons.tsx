import { StyleSheet, View } from 'react-native';
import ChangeModeButton from './ChangeModeButton';
import FileTypeChangeButton from './FileTypeChangeButton';
import ImportButton from './ImportButton';

function Buttons() {
  return (
    <View style={styles.container}>
      <ImportButton />
      <View style={styles.ml}>
        <FileTypeChangeButton />
      </View>
      <View style={styles.ml}>
        <ChangeModeButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  ml: {
    marginLeft: 10,
  },
});

export default Buttons;
