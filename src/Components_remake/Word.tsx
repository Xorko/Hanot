import {Dimensions, StyleSheet, View} from 'react-native';
import {AnnotationArea} from '../utils/AnnotationArea';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function Word() {
  return (
    <View style={styles.main}>
      <View style={styles.box}>
        <AnnotationArea />
      </View>
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
    height: windowHeight / 2.6,
    width: windowWidth / 1.5,
    borderRadius: 15,
    borderWidth: 10,
    borderColor: '#0071ac',
    overflow: 'hidden',
  },
});
export default Word;
