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
    alignContent: 'center',
  },
});
export default LettersAnnotation;
