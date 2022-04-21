/**
 * Limits the number of characters in a string.
 *
 * @param str The string to limit.
 * @param n The number of characters to limit the string to.
 * @returns The original string if it is less than or equal to the limit, otherwise the limited string followed by `...`.
 */
export const limitStringLength = (str: string, n: number) => {
  if (str.length > n) {
    return `${str.split('').splice(0, n).join('')}...`;
  }
  return str;
};
