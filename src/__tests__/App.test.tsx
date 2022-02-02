/**
 * @format
 */

import 'react-native';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import App from '../App';

it('renders correctly', () => {
  renderer.create(<App />);
});

it('calculates 1 + 1 == 2', () => {
  expect(1 + 1).toBe(2);
});
