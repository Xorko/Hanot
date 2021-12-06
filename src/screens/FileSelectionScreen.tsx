import {DrawerScreenProps} from '@react-navigation/drawer';
import {Button, StyleSheet, View} from 'react-native';
import {DrawerParamList} from '../App';

type FileSelectionScreenProps = DrawerScreenProps<
  DrawerParamList,
  'File Selection'
>;

function FileSelectionScreen({navigation}: FileSelectionScreenProps) {
  return (
    <View style={styles.center}>
      <Button onPress={() => navigation.goBack()} title="Go back" />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FileSelectionScreen;
