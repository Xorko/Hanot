import React, { useState } from 'react';
import { GestureResponderEvent } from 'react-native';
import { Polyline } from 'react-native-svg';
import type { Point, Size } from '../types/image-annotation-types';
import {
  getExtremePointsOfPath,
  roundPointCoordinates,
} from '../utils/crop-utils';

type SvgPolylinePropsType = {
  path: Point[];
  closedPath: boolean;
  updatePath: (newPath: Point[]) => void;
  updateCrop: () => void;
  containerSize: Size;
};

function SvgPolyline({
  path,
  closedPath,
  updatePath,
  updateCrop,
  containerSize,
}: SvgPolylinePropsType) {
  const [previousDragPosition, setPreviousDragPosition] = useState<Point>();

  /**
   * Allow or deny the dragging of the polyline
   * @param e The event that is triggered when the user tries to drag the point
   * @returns True if the point can be dragged, false otherwise
   */
  const startDrag = (e: GestureResponderEvent) => {
    // A polyline can only be dragged if it is closed
    if (closedPath) {
      setPreviousDragPosition({
        x: e.nativeEvent.locationX,
        y: e.nativeEvent.locationY,
      });
      return true;
    } else {
      return false;
    }
  };

  /**
   * Handle the dragging of the polyline
   * @param e The event that is triggered when the user drags the point
   */
  const drag = (e: GestureResponderEvent) => {
    if (previousDragPosition) {
      const { x: lastX, y: lastY } = previousDragPosition;
      const { x: newX, y: newY } = {
        x: e.nativeEvent.locationX,
        y: e.nativeEvent.locationY,
      };

      const deltaX = newX - lastX;
      const deltaY = newY - lastY;

      const newPath = path.map(point =>
        roundPointCoordinates({
          x: point.x + deltaX,
          y: point.y + deltaY,
        }),
      );
      const { minX, minY, maxX, maxY } = getExtremePointsOfPath(newPath);

      if (
        minX < 0 ||
        minY < 0 ||
        maxX > containerSize.width ||
        maxY > containerSize.height
      ) {
        path.pop();
        updatePath(path);
      } else {
        setPreviousDragPosition({ x: newX, y: newY });

        newPath.pop();
        updatePath(newPath);
      }
    }
  };

  const points = path.map(({ x, y }) => `${x},${y}`).join(' ');
  return (
    <Polyline
      points={points}
      fill="rgba(0,0,0,0)"
      stroke="white"
      strokeWidth="1.5"
      strokeDasharray="5"
      strokeDashoffset="0"
      onStartShouldSetResponder={startDrag}
      onResponderMove={drag}
      onResponderEnd={updateCrop}
    />
  );
}

export default SvgPolyline;
