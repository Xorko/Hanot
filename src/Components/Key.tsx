import {faCheckCircle, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {StyleSheet, Text, View} from 'react-native';

function Key() {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>
        <FontAwesomeIcon style={styles.validateIcon} icon={faCheckCircle} />{' '}
        Valider votre lettre
      </Text>
      <Text style={styles.text}>
        <FontAwesomeIcon style={styles.removeIcon} icon={faTimesCircle} />{' '}
        Supprimer le cadre
      </Text>
      <Text style={styles.text}>
        <FontAwesomeIcon style={styles.noiseIcon} icon={faTimesCircle} />{' '}
        Spécifier la lettre comme bruit
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: '0.5%',
    paddingHorizontal: '1%',
    paddingVertical: '0.6%',
    backgroundColor: '#686de0',
    borderRadius: 15,
  },
  text: {
    color: '#dff9fb',
    fontSize: 20,
    fontWeight: '500',
    paddingHorizontal: 8,
  },
  validateIcon: {
    paddingHorizontal: '0%',
    color: 'green',
  },
  removeIcon: {
    paddingHorizontal: '0%',
    color: 'red',
  },
  noiseIcon: {
    color: 'yellow',
  },
});
export default Key;
