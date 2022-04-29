import React from 'react';
import { Polygon } from 'react-native-svg';
import type { Point } from '../types/image-annotation-types';

type SvgPolygonPropsType = {
  path: Point[];
};

function SvgPolygon({ path }: SvgPolygonPropsType) {
  const points = path.map(({ x, y }) => `${x},${y}`).join(' ');
  return (
    <Polygon points={points} fill="rgba(0, 0, 0, 0.5)" fillRule="evenodd" />
  );
}

export default SvgPolygon;
