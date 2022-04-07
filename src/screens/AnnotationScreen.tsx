/* eslint-disable react-native/no-inline-styles */
import {Button, Dimensions, StyleSheet, View} from 'react-native';
import LettersMenu from '../Components_remake/LettersMenu';
import SideBar from '../Components_remake/SideBar';
import Word from '../Components_remake/Word';

const windowWidth = Dimensions.get('window').width;

interface AnnotationScreenProps {
  navigation: any;
}

function AnnotationScreen(props: AnnotationScreenProps) {
  const fileScreen = () => {
    console.log('yes');
    props.navigation.navigate('FileSelectionScreen');
  };

  return (
    <View style={styles.screen}>
      <SideBar />
      <View style={styles.annotation}>
        <View style={styles.home}>
          <Button title="Menu" onPress={() => fileScreen()} />
        </View>
        <LettersMenu />
        <Word />
      </View>
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
  home: {
    position: 'absolute',
    right: 30,
    top: 30,
  },
});
export default AnnotationScreen;
