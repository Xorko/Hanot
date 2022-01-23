import {Dimensions, StyleSheet, View} from 'react-native';
import {Shadow} from 'react-native-shadow-2';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function Letters() {
  return (
    <Shadow distance={15} viewStyle={{marginRight: 20}}>
      <View style={styles.box}>
        <View style={styles.letterWriting} />
        <View style={styles.letterTitle} />
      </View>
    </Shadow>
  );
}

const styles = StyleSheet.create({
  box: {
    alignSelf: 'center',
    backgroundColor: '#005b9f',
    height: windowHeight / 4,
    width: windowWidth / 8,
    borderRadius: 20,
  },
  letterWriting: {
    margin: 12,
    height: '65%',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  letterTitle: {
    backgroundColor: 'white',
    height: '15%',
    borderRadius: 10,
    marginBottom: 12,
    marginTop: 0,
    marginHorizontal: 60,
  },
});
export default Letters;
