import { render } from '@testing-library/react-native';
import colors from '../../style/colors';
import Text from '../Text';

test('renders the correct text', () => {
  const expected = 'Hello World';
  const { queryByText } = render(<Text variant="primary">{expected}</Text>);
  expect(queryByText(/hello world/i)).toHaveTextContent(expected);
});

test('renders with the correct color', () => {
  const { queryByText, rerender } = render(
    <Text variant="primary">Hello World</Text>,
  );
  expect(queryByText(/hello world/i)).toHaveStyle({ color: colors.primary });

  rerender(<Text variant="secondary">Hello World</Text>);
  expect(queryByText(/hello world/i)).toHaveStyle({ color: colors.secondary });

  rerender(<Text variant="success">Hello World</Text>);
  expect(queryByText(/hello world/i)).toHaveStyle({ color: colors.success });

  rerender(<Text variant="danger">Hello World</Text>);
  expect(queryByText(/hello world/i)).toHaveStyle({ color: colors.danger });

  rerender(<Text variant="warning">Hello World</Text>);
  expect(queryByText(/hello world/i)).toHaveStyle({ color: colors.warning });

  rerender(<Text variant="info">Hello World</Text>);
  expect(queryByText(/hello world/i)).toHaveStyle({ color: colors.info });

  rerender(<Text variant="light">Hello World</Text>);
  expect(queryByText(/hello world/i)).toHaveStyle({ color: colors.light });

  rerender(<Text variant="dark">Hello World</Text>);
  expect(queryByText(/hello world/i)).toHaveStyle({ color: colors.dark });
});
