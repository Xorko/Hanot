import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as ReduxProvider } from 'react-redux';
import { DrawerFilesContextProvider } from '../context/DrawerFilesContext';
import { FileTypeProvider } from '../context/FileTypeContext';
import { store } from '../stores/store';

type AppProvidersProps = {
  children: React.ReactNode;
};

function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <NavigationContainer>
        <GestureHandlerRootView style={styles.ghrv}>
          <FileTypeProvider>
            <DrawerFilesContextProvider>{children}</DrawerFilesContextProvider>
          </FileTypeProvider>
        </GestureHandlerRootView>
      </NavigationContainer>
    </ReduxProvider>
  );
}

const styles = StyleSheet.create({
  ghrv: {
    flex: 1,
  },
});

export default AppProviders;
