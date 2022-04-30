import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { ImageFile, InkMLFile } from '../../types/file-import-types';
import { RootStackParamList } from '../../types/navigation-types';
import Drawer from './components/Drawer';
import { DrawerStateProvider } from './context/DrawerStateContext';
import ImageAnnotation from './image-annotation-screen/ImageAnnotation';
import InkmlAnnotation from './inkml-annotation-screen/InkmlAnnotation';

type AnnotationScreenPropsType = NativeStackScreenProps<
  RootStackParamList,
  'AnnotationScreen'
>;

function AnnotationScreen({ route }: AnnotationScreenPropsType) {
  const { type, file } = route.params;

  return (
    <SafeAreaView style={styles.mainContainer}>
      <DrawerStateProvider>
        <View style={styles.container}>
          <Drawer />
          <View style={styles.contentContainer}>
            {type === 'inkml' && <InkmlAnnotation file={file as InkMLFile} />}
            {type === 'image' && <ImageAnnotation file={file as ImageFile} />}
          </View>
        </View>
      </DrawerStateProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#E0E0E0',
  },
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  contentContainer: {
    flex: 1,
  },
});

export default AnnotationScreen;
