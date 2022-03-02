import {Dimensions, StyleSheet, View} from 'react-native';

const windowWidth = Dimensions.get('window').width;

function SideBar() {
  return <View style={styles.box} />;
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: windowWidth - windowWidth / 1.07,
    height: '100%',
    paddingVertical: 25,
  },
});
export default SideBar;

/*
 <View
        style={{
          flex: 1,
          width: '90%',
          height: '10%',
          backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <FontAwesomeIcon
          icon={faBars}
          style={{padding: 4, color: 'white'}}
          size={40}
        />
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
*/
