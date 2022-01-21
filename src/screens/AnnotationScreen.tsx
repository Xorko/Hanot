import {StyleSheet, View} from 'react-native';
import Footer from '../Components/Footer';
import Header from '../Components/Header';
import LettersAnnotation from '../Components/LettersAnnotation';
import Word from '../Components/Word';

function AnnotationScreen() {
  return (
    <View style={styles.annotation}>
      <Header />
      <LettersAnnotation />
      <Word />
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  annotation: {
    flex: 1,
    justifyContent: 'space-between',
    alignContent: 'flex-start',
  },
});
export default AnnotationScreen;
