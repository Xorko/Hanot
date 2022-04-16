import { createStackNavigator } from '@react-navigation/stack';
import AppProviders from './components/AppProvider';
import ImageAnnotationScreen from './screens/annotation/image-annotation-screen/ImageAnnotationScreen';
import InkmlAnnotationScreen from './screens/annotation/inkml-annotation-screen/InkmlAnnotationScreen';
import FileSelectionScreen from './screens/file-selection-screen/FileSelectionScreen';

export type DrawerParamList = {
  Annotation: undefined;
  'File Selection': undefined;
};

const { Navigator, Screen } = createStackNavigator();

function App() {
  return (
    <AppProviders>
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
    </AppProviders>
  );
}

export default App;
