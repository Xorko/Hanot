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
    backgroundColor: '#c7ecee',
    borderRadius: 15,
    marginTop: 20,
    marginHorizontal: 20,
  },
});

export default Header;
