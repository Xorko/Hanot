import {StyleSheet, View} from 'react-native';
import ButtonChangeMode from './ButtonChangeMode';

function HeaderFiles() {
  return (
    <View style={styles.head}>
      <ButtonChangeMode />
    </View>
  );
}

const styles = StyleSheet.create({
  head: {
    flex: 0.08,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    height: '100%',
    width: '100%',
  },
});
export default HeaderFiles;
