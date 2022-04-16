import {Dimensions, StyleSheet, View} from 'react-native';
import AddLetterButton from './AddLetterButton';
import RemoveLetterButton from './RemoveLetterButton';
import ValidateLetterButton from './ValidateLetterButton';

const windowHeight = Dimensions.get('window').height;

function LettersButtons() {
  return (
    <View style={styles.box}>
      <ValidateLetterButton />
      <AddLetterButton />
      <RemoveLetterButton />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    height: windowHeight / 2.5,
    padding: 17,
    justifyContent: 'space-between',
  },
});

export default LettersButtons;
