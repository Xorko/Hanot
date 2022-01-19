/*
  background: #141A32
  blue: #3E65FB
  whity-grey: #D2D2D7
  light-blue: #809CF5
  primary: #5A6583
  card: #212B4E
*/

import {StyleSheet, View} from 'react-native';
import AnnotationScreen from './screens/AnnotationScreen';

export type DrawerParamList = {
  Annotation: undefined;
  'File Selection': undefined;
};

//const Drawer = createDrawerNavigator<DrawerParamList>();

function App() {
  //const isDarkMode = useColorScheme();

  return (
    <View style={styles.view}>
      <AnnotationScreen />
    </View>

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
};*/

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#dff9fb',
    color: '#D2D2D7',
  },
});

export default App;
