import {StyleSheet, Text, View} from 'react-native';

function Word() {
  return (
    <View style={styles.box}>
      <Text>Word</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: 'white',
    height: '45%',
  },
});

export default Word;
