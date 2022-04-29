import React from 'react';
import { Polygon } from 'react-native-svg';
import type { Coordinates } from '../../../types/coordinates-types';

type SvgPolygonPropsType = {
  path: Coordinates[];
};

function SvgPolygon({ path }: SvgPolygonPropsType) {
  const points = path.map(({ x, y }) => `${x},${y}`).join(' ');
  return (
    <Polygon points={points} fill="rgba(0, 0, 0, 0.5)" fillRule="evenodd" />
  );
}

export default SvgPolygon;
