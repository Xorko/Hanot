import {DrawerScreenProps} from '@react-navigation/drawer';
import {Button, StyleSheet, View} from 'react-native';
import {DrawerParamList} from '../App';

type AnnotationScreenProps = DrawerScreenProps<DrawerParamList, 'Annotation'>;

function AnnotationScreen({navigation}: AnnotationScreenProps) {
  return (
    <View style={styles.center}>
      <Button
        onPress={() => navigation.navigate('File Selection')}
        title="Go to file selection"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AnnotationScreen;
