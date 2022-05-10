import { distance } from '../math-utils';

it('distance : Math methods return right results', () => {
  const pointA = { x: 10, y: 17 };
  const pointB = { x: 1, y: 17 };
  const result: number = 9;
  expect(distance(pointA, pointB)).toEqual(result);
});
