import { NavigationContainer } from '@react-navigation/native';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../app/store';

interface AppProvidersProps {
  children: React.ReactNode;
}

function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <NavigationContainer>{children}</NavigationContainer>
    </ReduxProvider>
  );
}

export default AppProviders;
