import { StyleSheet, View } from 'react-native';
import colors from '../../../style/colors';

type AnnotationAreaProps = {
  children: React.ReactNode;
};

function AnnotationArea({ children }: AnnotationAreaProps) {
  return <View style={[styles.container, styles.shadow]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    borderColor: colors.primary,
    borderRadius: 10,
    backgroundColor: colors.light,
    padding: 10,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
});

export default AnnotationArea;
