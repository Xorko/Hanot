import {StyleSheet, Text, TouchableOpacity} from 'react-native';

function ValidateButton() {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.text}> ✅ VALIDER </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginBottom: '2%',
    marginRight: '2%',
    alignSelf: 'flex-end',
    backgroundColor: '#3E65FB',
    paddingVertical: '0.5%',
    paddingHorizontal: '1%',
    borderRadius: 50,
  },
  text: {
    color: '#D2D2D7',
    fontSize: 20,
    fontWeight: '500',
    letterSpacing: 1.5,
  },
});

export default ValidateButton;
