import {StyleSheet, View} from 'react-native';
import ChangeModeButton from './ChangeModeButton';
import FileTypeChangeButton from './FileTypeChangeButton';
import ImportButton from './ImportButton';

function Buttons() {
  return (
    <View style={styles.head}>
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
  head: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    right: 30,
    top: 30,
  },
  ml: {
    marginLeft: 10,
  },
});

export default Buttons;
