import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import React from 'react';
import {useColorScheme} from 'react-native';
import AnnotationScreen from './screens/AnnotationScreen';
import FileSelectionScreen from './screens/FileSelectionScreen';

export type DrawerParamList = {
  Annotation: undefined;
  'File Selection': undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
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
    </NavigationContainer>
  );
}

export default App;
