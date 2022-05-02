import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { ImageFile, InkMLFile } from '../../types/file-import-types';
import { NavigationProp } from '../../types/navigation-types';
import CustomDrawerContent from './components/DrawerContent';
import ImageAnnotation from './image-annotation-screen/ImageAnnotation';
import InkmlAnnotation from './inkml-annotation-screen/InkmlAnnotation';

type AnnotationScreenPropsType = NavigationProp;

const Drawer = createDrawerNavigator();

function DrawerNavigation({ route }: AnnotationScreenPropsType) {
  const { type } = route.params.params; // Nested navigators seems to also nest params

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        swipeEnabled: false,
        drawerType: 'front',
      }}
      drawerContent={props => (
        <CustomDrawerContent fileType={type} {...props} />
      )}>
      <Drawer.Screen name="Annotation" component={AnnotationScreen} />
    </Drawer.Navigator>
  );
}

function AnnotationScreen({ route }: AnnotationScreenPropsType) {
  const { type, file } = route.params;

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          {type === 'inkml' && <InkmlAnnotation file={file as InkMLFile} />}
          {type === 'image' && <ImageAnnotation file={file as ImageFile} />}
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

export default DrawerNavigation;
