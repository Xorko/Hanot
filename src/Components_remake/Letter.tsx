import { Dimensions, StyleSheet, View } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function Letter() {
  return (
    <View style={styles.box}>
      <View style={styles.letterWriting} />
      <View style={styles.letterTitle} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignSelf: 'center',
    backgroundColor: '#005b9f',
    height: windowHeight / 3,
    width: windowWidth / 7,
    borderRadius: 15,
  },
  letterWriting: {
    margin: 10,
    height: '70%',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  letterTitle: {
    backgroundColor: 'white',
    height: '18%',
    borderRadius: 10,
    marginBottom: 12,
    marginTop: 0,
    marginHorizontal: 60,
  },
});
export default Letter;
