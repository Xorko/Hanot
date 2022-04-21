import { limitStringLength } from '../string-utils';

test('it must return the original string if the length is less than n', () => {
  const str = 'foo';

  const result = limitStringLength(str, str.length + 1);

  expect(result).toEqual(str);
});

test('it must return the original string if the length is equal to n', () => {
  const str = 'foo';

  const result = limitStringLength(str, str.length);

  expect(result).toEqual(str);
});

test('it must return a string with n + 3 characters if the length is greater than n', () => {
  const str = 'foo';

  const result = limitStringLength(str, str.length - 1);

  expect(result).toEqual(`${str.substring(0, str.length - 1)}...`);
});
