import {useContext} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ModeContext} from '../Context/ModeContext';

function ButtonChangeMode() {
  const {mode, changeMode} = useContext(ModeContext);

  const onPress = () => {
    if (mode === 'block') {
      changeMode('list');
    } else if (mode === 'list') {
      changeMode('block');
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={1}>
      <View>
        <Text style={styles.text}> Changer de mode </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginBottom: '2%',
    marginRight: '2%',
    alignSelf: 'flex-end',
    backgroundColor: 'black',
    paddingVertical: '0.5%',
    paddingHorizontal: '1%',
    borderRadius: 50,
  },
  text: {
    color: '#dff9fb',
    fontSize: 20,
    fontWeight: '500',
    letterSpacing: 1.5,
  },
});

export default ButtonChangeMode;
