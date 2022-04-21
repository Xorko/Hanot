export const limitStringLength = (str: string, n: number) => {
  if (str.length > n) {
    return `${str.split('').splice(0, n).join('')}...`;
  }
  return str;
};
