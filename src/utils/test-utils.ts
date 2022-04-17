import { render, RenderOptions } from '@testing-library/react-native';
import AppProviders from '../components/AppProvider';

const customRender = (
  ui: React.ReactElement<any>,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AppProviders, ...options });

export * from '@testing-library/react-native';
export { customRender as render };
