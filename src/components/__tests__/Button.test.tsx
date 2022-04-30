import colors from '../../style/colors';
import { fireEvent, render } from '../../utils/test-utils';
import Button from '../Button';

test('it should call the onPress function when pressed', () => {
  const onPress = jest.fn();
  const { getByTestId } = render(
    <Button variant="primary" title="test" onPress={onPress} />,
  );

  fireEvent(getByTestId('btn'), 'press');

  expect(onPress).toHaveBeenCalledTimes(1);
});

test('renders with the correct background color', () => {
  const { getByTestId, rerender } = render(
    <Button variant="primary" title="test" />,
  );
  expect(getByTestId('btn')).toHaveStyle({ backgroundColor: colors.primary });

  rerender(<Button variant="secondary" title="test" />);
  expect(getByTestId('btn')).toHaveStyle({ backgroundColor: colors.secondary });

  rerender(<Button variant="success" title="test" />);
  expect(getByTestId('btn')).toHaveStyle({ backgroundColor: colors.success });

  rerender(<Button variant="danger" title="test" />);
  expect(getByTestId('btn')).toHaveStyle({ backgroundColor: colors.danger });

  rerender(<Button variant="warning" title="test" />);
  expect(getByTestId('btn')).toHaveStyle({ backgroundColor: colors.warning });

  rerender(<Button variant="info" title="test" />);
  expect(getByTestId('btn')).toHaveStyle({ backgroundColor: colors.info });

  rerender(<Button variant="light" title="test" />);
  expect(getByTestId('btn')).toHaveStyle({ backgroundColor: colors.light });

  rerender(<Button variant="dark" title="test" />);
  expect(getByTestId('btn')).toHaveStyle({ backgroundColor: colors.dark });
});
