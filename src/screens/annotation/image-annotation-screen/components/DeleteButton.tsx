import React from 'react';
import {Animated, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface DeleteButtonPropsType {
  deleteCrop: () => void;
}

const DeleteButton = ({deleteCrop}: DeleteButtonPropsType) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={deleteCrop}>
      <Animated.View style={styles.button}>
        <Icon name="times-circle" size={40} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0069c0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
});

export default DeleteButton;
