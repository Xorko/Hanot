import {
  StyleProp,
  StyleSheet,
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from 'react-native';
import colors from '../style/colors';

type TextProps = {
  variant: keyof typeof colors;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
} & RNTextProps;

function Text({ variant: status, style, children, ...props }: TextProps) {
  return (
    <RNText style={[style, styles[status]]} {...props}>
      {children}
    </RNText>
  );
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
  inkml: {
    color: colors.inkml,
  },
  image: {
    color: colors.image,
  },
});

export default Text;
