import { StyleSheet, View } from 'react-native';
import ImportButton from './ImportButton';
import OpenFileButton from './OpenFileButton';
import RemoveFileButton from './RemoveFileButton';

function Buttons() {
  return (
    <View style={styles.container}>
      <View style={styles.ml}>
        <ImportButton />
      </View>
      <View style={styles.ml}>
        <RemoveFileButton />
      </View>
      <View style={styles.ml}>
        <OpenFileButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 40,
  },
  ml: {
    paddingHorizontal: 20,
  },
});

export default Buttons;
