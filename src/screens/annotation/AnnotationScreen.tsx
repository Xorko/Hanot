import { SafeAreaView, StyleSheet, View } from 'react-native';
import { ImageFile, InkMLFile } from '../../types/file-import-types';
import { NavigationProp } from '../../types/navigation-types';
import ScrollViewRefProvider from './context/ScrollViewRefContext';
import ImageAnnotation from './image-annotation/ImageAnnotation';
import InkmlAnnotation from './inkml-annotation/InkmlAnnotation';

type AnnotationScreenPropsType = NavigationProp;

function AnnotationScreen({ route }: AnnotationScreenPropsType) {
  const { type, file } = route.params;

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <ScrollViewRefProvider>
            {type === 'inkml' && <InkmlAnnotation file={file as InkMLFile} />}
            {type === 'image' && <ImageAnnotation file={file as ImageFile} />}
          </ScrollViewRefProvider>
        </View>
      </View>
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
