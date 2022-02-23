import {StyleSheet, View} from 'react-native';
import Footer from '../Components/Footer';
import Header from '../Components/Header';

function AnnotationScreen() {
  return (
    <View style={styles.annotation}>
      <Header />
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  annotation: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
export default AnnotationScreen;
