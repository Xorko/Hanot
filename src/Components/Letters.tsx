import {ScrollView, StyleSheet, View} from 'react-native';
import OneLetter from './OneLetter';

function Letters() {
  return (
    <View style={styles.box}>
      <ScrollView horizontal={true}>
        <OneLetter />
        <OneLetter />
        <OneLetter />
        <OneLetter />
        <OneLetter />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  box: {
    flex: 6,
    padding: 7,
    width: '50%',
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#686de0',
    borderRadius: 15,
  },
});
export default Letters;
