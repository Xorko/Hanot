import { StyleProp, StyleSheet, Text as RNText, TextStyle } from 'react-native';
import colors from '../style/colors';

type TextProps = {
  variant: keyof typeof colors;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
};

function Text({ variant: status, style, children }: TextProps) {
  return <RNText style={[style, styles[status]]}>{children}</RNText>;
}

const styles = StyleSheet.create({
  primary: {
    color: colors.primary,
  },
  secondary: {
    color: colors.secondary,
  },
  success: {
    color: colors.success,
  },
  danger: {
    color: colors.danger,
  },
  warning: {
    color: colors.warning,
  },
  info: {
    color: colors.info,
  },
  light: {
    color: colors.light,
  },
  dark: {
    color: colors.dark,
  },
});

export default Text;
