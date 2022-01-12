import {StyleSheet, View} from 'react-native';
import HomeButton from './HomeButton';

function Header() {
  return (
    <View style={styles.view}>
      <HomeButton />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#212B4E',
  },
});

export default Header;
