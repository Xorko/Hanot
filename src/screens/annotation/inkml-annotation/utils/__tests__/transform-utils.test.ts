import { Coordinates, Size } from '../../../../../types/coordinates-types';
import { Transform } from '../../types/annotation-types';
import { getTransform, reverseTransform } from '../transform-utils';

it('getTransform : word smaller than area', () => {
  const coordinates: Coordinates[] = [
    { x: 0, y: 0 },
    { x: 50, y: 100 },
    { x: 395, y: 2 },
  ];
  const areaSize: Size = { width: 600, height: 300 };
  const result: any = { translateX: -2.5, translateY: -50, scale: 1.5 };
  expect(getTransform(coordinates, areaSize)).toEqual(result);
});

it('getTransform : word bigger than area', () => {
  const coordinates: Coordinates[] = [
    { x: 0, y: 0 },
    { x: 50, y: 400 },
    { x: 995, y: 2 },
  ];
  const areaSize: Size = { width: 600, height: 300 };
  const result: any = { translateX: -2.5, translateY: -50, scale: 0.6 };
  expect(getTransform(coordinates, areaSize)).toEqual(result);
});

it('getTransform : wordWidth > areaSize.width', () => {
  const coordinates: Coordinates[] = [
    { x: 0, y: 0 },
    { x: 50, y: 995 },
    { x: 795, y: 2 },
  ];
  const areaSize: Size = { width: 600, height: 300 };
  const result: any = { translateX: -602.5, translateY: -2.5, scale: 0.3 };
  expect(getTransform(coordinates, areaSize)).toEqual(result);
});

it('reverseTransform : ', () => {
  const coordinate: Coordinates = { x: 50, y: 20 };
  const transform: Transform = { scale: 2, translateX: 1, translateY: 0.5 };
  const result: any = { x: 26, y: 10.5 };
  expect(reverseTransform(coordinate, transform)).toEqual(result);
});
