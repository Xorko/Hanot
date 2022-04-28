import { fireEvent, render } from 'test-utils';
import IconButton from '../IconButton';

test('it should call the onPress function when pressed', () => {
  const onPress = jest.fn();
  const { getByTestId } = render(
    <IconButton library="material" iconName="home" onPress={onPress} />,
  );

  fireEvent(getByTestId('icon-btn'), 'press');

  expect(onPress).toHaveBeenCalledTimes(1);
});
