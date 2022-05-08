import { useCallback } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../style/colors';
import Text from './Text';

type IconButtonProps = {
  title: string;
  activeOpacity?: number;
  onPress?: () => void;
  outline?: boolean;
  variant: keyof typeof colors;
};

function Button({
  title,
  activeOpacity,
  onPress,
  variant,
  outline,
}: IconButtonProps) {
  /**
   * Gets the variant of color to use
   * @returns the variant of color to use for the text
   */
  const getTextVariant = useCallback((): keyof typeof colors => {
    if (outline) {
      return variant;
    }

    return variant === 'light' ? 'dark' : 'light';
  }, [outline, variant]);

  return (
    <TouchableOpacity
      style={[
        !outline && colorStyles[variant],
        styles.buttonContainer,
        { borderColor: colors[variant] },
      ]}
      onPress={onPress}
      activeOpacity={activeOpacity || 0.8}
      testID="btn">
      <Text variant={getTextVariant()} selectable={false}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 10,
    borderRadius: 3,
    borderWidth: 1,
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
  inkml: {
    backgroundColor: colors.inkml,
  },
  image: {
    backgroundColor: colors.image,
  },
});

export default Button;
