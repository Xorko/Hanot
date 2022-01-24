import {faBars} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Dimensions, StyleSheet, View} from 'react-native';

const windowWidth = Dimensions.get('window').width;

function SideBar() {
  return (
    <View style={styles.box}>
      <View style={{flex: 1, width: '90%', backgroundColor: 'red'}}>
        <FontAwesomeIcon icon={faBars} style={{padding: 4, color: 'white'}} />
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: '90%',
          backgroundColor: 'green',
        }}>
        <FontAwesomeIcon icon={faBars} style={{padding: 4, color: 'white'}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: windowWidth - windowWidth / 1.07,
    paddingVertical: 25,
  },
});
export default SideBar;
