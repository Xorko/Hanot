import {StyleSheet, View} from 'react-native';
import Key from './Key';
import Letters from './Letters';

function LettersAnnotation() {
  return (
    <View style={styles.box}>
      <Key />
      <Letters />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    justifyContent: 'space-between',
    alignContent: 'flex-start',
    backgroundColor: 'black',
    marginBottom: '2%',
    marginTop: '1%',
  },
});
export default LettersAnnotation;
