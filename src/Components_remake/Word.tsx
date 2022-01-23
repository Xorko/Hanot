import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {Shadow} from 'react-native-shadow-2';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function Word() {
  return (
    <View style={styles.main}>
      <Shadow>
        <View style={styles.box}>
          <Text>This is where the word should go!</Text>
        </View>
      </Shadow>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  box: {
    backgroundColor: 'white',
    alignSelf: 'center',
    height: windowHeight / 3.4,
    width: windowWidth / 1.7,
    borderRadius: 35,
    borderWidth: 20,
    borderColor: '#0071ac',
  },
});
export default Word;
