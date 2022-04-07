import {Dimensions, StyleSheet, View} from 'react-native';
import ImageAnnotationArea from './ImageAnnotationArea';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ImageAnnotationContainer = () => {
  return (
    <View style={styles.main}>
      <View style={styles.box}>
        <ImageAnnotationArea />
      </View>
    </View>
  );
};

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
export default ImageAnnotationContainer;
