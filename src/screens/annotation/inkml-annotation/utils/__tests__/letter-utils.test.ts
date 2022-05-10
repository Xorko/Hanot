import { getMaxValue, getMinValue } from '../letter-utils';

it('max value returned', () => {
  const coords: number[] = [1, 2, 3, -4];
  expect(getMaxValue(coords)).toEqual(3);
});

it('min value returned', () => {
  const coords: number[] = [1, 2, 3, -4];
  expect(getMinValue(coords)).toEqual(-4);
});
