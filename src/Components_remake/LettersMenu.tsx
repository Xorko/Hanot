import {Dimensions, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Letters from './Letters';

const windowHeight = Dimensions.get('window').height;

function LettersMenu() {
  return (
    <View style={styles.box}>
      <ScrollView horizontal contentContainerStyle={styles.scroll}>
        <Letters />
        <Letters />
        <Letters />
        <Letters />
        <Letters />
        <Letters />
        <Letters />
      </ScrollView>
    </View>
  );
}
/*<Shadow distance={1} offset={[-30, 0]}>
        <View style={styles.buttons}>
          <Text>hello</Text>
        </View>
      </Shadow>*/

const styles = StyleSheet.create({
  box: {
    flex: 1,
    flexDirection: 'row',
    height: '30%',
    width: '60%',
    alignItems: 'center',
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

export default LettersMenu;
