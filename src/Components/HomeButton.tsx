import {faHome} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {StyleSheet, TouchableOpacity} from 'react-native';

function HomeButton() {
  return (
    <TouchableOpacity style={styles.button}>
      <FontAwesomeIcon color={'#130f40'} size={30} icon={faHome} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginBottom: '0.7%',
    marginTop: '0.7%',
    marginRight: '2%',
    alignSelf: 'flex-end',
    paddingVertical: '0.5%',
    paddingHorizontal: '0.5%',
    borderRadius: 50,
  },
});

export default HomeButton;
