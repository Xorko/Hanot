import {StyleSheet, Text, View} from 'react-native';

function OneLetter() {
  return (
    <View style={styles.box}>
      <View style={styles.svg}>
        <Text>We should see the svg here!!</Text>
      </View>
      <View style={styles.letter}>
        <Text>This is where we enter the letter!!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    height: '100%',
    width: 200,
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  svg: {
    backgroundColor: 'white',
    height: '70%',
    borderRadius: 7,
    padding: 5,
  },
  letter: {
    backgroundColor: 'white',
    borderRadius: 7,
    height: '25%',
    padding: 5,
    marginTop: 5,
  },
});

export default OneLetter;
