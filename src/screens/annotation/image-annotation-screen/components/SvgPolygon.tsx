import React from 'react';
import { Polygon } from 'react-native-svg';
import { Point } from '../types/image-annotation-types';

interface SvgPolygonPropsType {
  path: Point[];
}

const SvgPolygon = ({ path }: SvgPolygonPropsType) => {
  const points = path.map(({ x, y }) => `${x},${y}`).join(' ');
  return (
    <Polygon points={points} fill="rgba(0, 0, 0, 0.5)" fillRule="evenodd" />
  );
};

export default SvgPolygon;
