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
    marginTop: '20px',
    marginHorizontal: '20px',
  },
});

export default Header;
