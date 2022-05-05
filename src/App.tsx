import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import AppProviders from './components/AppProvider';
import AnnotationScreenNavigator from './screens/annotation/AnnotationScreenNavigator';
import FileSelectionScreen from './screens/file-selection-screen/FileSelectionScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <AppProviders>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="FileSelectionScreen">
        <Stack.Screen
          name="AnnotationScreen"
          component={AnnotationScreenNavigator}
        />
        <Stack.Screen
          name="FileSelectionScreen"
          component={FileSelectionScreen}
        />
      </Stack.Navigator>
      <Toast />
    </AppProviders>
  );
}

export default App;
