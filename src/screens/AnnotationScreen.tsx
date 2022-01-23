import {StyleSheet, View} from 'react-native';
import Footer from '../Components_remake/Footer';
import Header from '../Components_remake/Header';
import LettersMenu from '../Components_remake/LettersMenu';
import Word from '../Components_remake/Word';

function AnnotationScreen() {
  return (
    <View style={styles.annotation}>
      <Header />
      <LettersMenu />
      <Word />
      <Footer />
    </View>
  );
  /*return (
    <View style={styles.annotation}>
      <Header />
      <LettersAnnotation />
      <Word />
      <Footer />
    </View>
  );*/
}

const styles = StyleSheet.create({
  annotation: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
export default AnnotationScreen;
