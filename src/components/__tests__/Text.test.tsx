import { render } from '@testing-library/react-native';
import Text from '../Text';

test('renders correctly', () => {
  const expected = 'Hello World';
  const { queryByText } = render(<Text variant="primary">{expected}</Text>);
  expect(queryByText(/hello world/i)).toHaveTextContent(expected);
});
