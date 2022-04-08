import {Dimensions, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const ImageLettersMenu = () => {
  return (
    <View style={styles.box}>
      <ScrollView horizontal contentContainerStyle={styles.scroll} />
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    flex: 1,
    flexDirection: 'row',
    height: windowHeight / 2.5,
    width: windowWidth / 1.5,
    alignItems: 'center',
    marginRight: '2.7%',
  },
  scroll: {
    backgroundColor: '#e1e2e1',
    flexGrow: 1,
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttons: {
    backgroundColor: '#e1e2e1',
    height: windowHeight / 3,
    width: 1,
  },
});

export default ImageLettersMenu;
