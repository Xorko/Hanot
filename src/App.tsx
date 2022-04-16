/*
  background: #141A32
  blue: #3E65FB
  whity-grey: #D2D2D7
  light-blue: #809CF5
  primary: #5A6583
  card: #212B4E
*/

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from './app/store';
import ImageAnnotationScreen from './screens/annotation/image-annotation-screen/ImageAnnotationScreen';
import InkmlAnnotationScreen from './screens/annotation/inkml-annotation-screen/InkmlAnnotationScreen';
import FileSelectionScreen from './screens/file-selection-screen/FileSelectionScreen';

export type DrawerParamList = {
  Annotation: undefined;
  'File Selection': undefined;
};

//const Drawer = createDrawerNavigator<DrawerParamList>();

//const Stack = createStackNavigator();

const { Navigator, Screen } = createStackNavigator();

function App() {
  //const isDarkMode = useColorScheme();

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="FileSelectionScreen">
          <Screen
            name="InkMLAnnotationScreen"
            component={InkmlAnnotationScreen}
          />
          <Screen
            name="ImageAnnotationScreen"
            component={ImageAnnotationScreen}
          />
          <Screen name="FileSelectionScreen" component={FileSelectionScreen} />
        </Navigator>
      </NavigationContainer>
    </Provider>

    /*<View style={styles.view}>
      <AnnotationScreen />
    </View>*/

    /*<NavigationContainer theme={isDarkMode ? MyTheme : DefaultTheme}>
      <Drawer.Navigator initialRouteName="Annotation">
        <Drawer.Screen
          name="Annotation"
          key="Annotation"
          component={AnnotationScreen}
        />
        <Drawer.Screen
          name="File Selection"
          key="FileSelection"
          component={FileSelectionScreen}
        />
      </Drawer.Navigator>
    </NavigationContainer>*/
  );
}

/*const MyTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#141A32',
    primary: '#809CF5',
    card: '#212B4E',
    text: '#D2D2D7',
    border: '#3E65FB',
  },
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#0071ac',
  },
});
*/
export default App;
