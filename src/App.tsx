import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import AppProviders from './components/AppProvider';
import AnnotationScreen from './screens/annotation/AnnotationScreen';
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
        <Screen name="AnnotationScreen" component={AnnotationScreen} />
        <Screen name="FileSelectionScreen" component={FileSelectionScreen} />
      </Navigator>
      <Toast />
    </AppProviders>
  );
}

export default App;
