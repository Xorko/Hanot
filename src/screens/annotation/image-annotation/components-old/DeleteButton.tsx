import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

type DeleteButtonPropsType = {
  deleteCrop: () => void;
};

function DeleteButton({ deleteCrop }: DeleteButtonPropsType) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={deleteCrop}>
      <Animated.View style={styles.button}>
        <Icon name="times-circle" size={40} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0069c0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
});

export default DeleteButton;
