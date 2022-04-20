import { StyleSheet, View } from 'react-native';
import ExportButton from './ExportButton';
import RemoveFileButton from './RemoveFileButton';

function Buttons() {
  return (
    <View style={styles.container}>
      <View style={styles.ml}>
        <ExportButton />
      </View>
      <View style={styles.ml}>
        <RemoveFileButton />
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
