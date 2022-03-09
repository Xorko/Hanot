/* eslint-disable react-native/no-inline-styles */
import {Dimensions, StyleSheet, View} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import LettersMenu from '../Components_remake/LettersMenu';
import SideBar from '../Components_remake/SideBar';
import Word from '../Components_remake/Word';

const windowWidth = Dimensions.get('window').width;

function AnnotationScreen() {
  return (
    <View style={styles.screen}>
      <SideBar />
      <Shadow containerViewStyle={{alignSelf: 'flex-end'}}>
        <View style={styles.annotation}>
          <LettersMenu />
          <Word />
        </View>
      </Shadow>
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
    width: windowWidth / 1.07,
    backgroundColor: '#e1e2e1',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 40,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  screen: {
    height: '100%',
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
export default AnnotationScreen;
