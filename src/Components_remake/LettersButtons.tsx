import {Button, StyleSheet, View} from 'react-native';

function LettersButtons() {
  return (
    <View style={styles.box}>
      <Button title="1" />
      <Button title="2" />
      <Button title="3" onPress={() => console.log('hello')} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    paddingLeft: 10,
    justifyContent: 'space-between',
  },
});

export default LettersButtons;
