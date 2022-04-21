import { StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../style/colors';
import Text from './Text';

type IconButtonProps = {
  title: string;
  activeOpacity?: number;
  onPress: () => void;
  variant: keyof typeof colors;
};

function Button({ title, activeOpacity, onPress, variant }: IconButtonProps) {
  return (
    <TouchableOpacity
      style={[colorStyles[variant], [styles.buttonContainer]]}
      onPress={onPress}
      activeOpacity={activeOpacity || 0.8}
      testID="btn">
      <Text variant="light">{title}</Text>
    </TouchableOpacity>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     borderWidth: 1,
//     borderColor: 'white',
//     backgroundColor: 'black',
//     marginHorizontal: 10,
//   },
//   police: {
//     color: 'white',
//     marginHorizontal: 20,
//     fontSize: 20,
//   },
// });

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 10,
    borderRadius: 3,
  },
});

const colorStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  success: {
    backgroundColor: colors.success,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  warning: {
    backgroundColor: colors.warning,
  },
  info: {
    backgroundColor: colors.info,
  },
  light: {
    backgroundColor: colors.light,
  },
  dark: {
    backgroundColor: colors.dark,
  },
});

export default Button;
