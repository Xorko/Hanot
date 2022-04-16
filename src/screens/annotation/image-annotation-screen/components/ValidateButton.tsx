import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface ValidateButtonPropsType {
  validateCrop: () => void;
}

const ValidateButton = ({ validateCrop }: ValidateButtonPropsType) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={validateCrop}>
      <View style={styles.button}>
        <Icon name="check-circle" size={40} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#087f23',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
});

export default ValidateButton;
