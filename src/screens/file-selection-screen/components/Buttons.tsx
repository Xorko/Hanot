import { StyleSheet, View } from 'react-native';
import ExportFileButton from './ExportButton';
import OpenFileButton from './OpenFileButton';
import RemoveFileButton from './RemoveFileButton';

function Buttons() {
  return (
    <View style={styles.container}>
      <View style={styles.px}>
        <OpenFileButton />
      </View>
      <View style={styles.px}>
        <RemoveFileButton />
      </View>
      <View style={styles.px}>
        <ExportFileButton />
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
  px: {
    paddingHorizontal: 20,
  },
});

export default Buttons;
