import React, {useState} from 'react';
import {GestureResponderEvent} from 'react-native';
import {Polyline} from 'react-native-svg';
import {Point} from '../types/image-annotation-types';
import {roundPointCoordinates} from '../utils/crop-utils';

interface SvgPolylinePropsType {
  path: Point[];
  closedPath: boolean;
  updatePath: (newPath: Point[]) => void;
  updateCrop: () => void;
}

const SvgPolyline = ({
  path,
  closedPath,
  updatePath,
  updateCrop,
}: SvgPolylinePropsType) => {
  const [lastDragPosition, setLastDragPosition] = useState<Point>();

  const handleStartShouldSetResponder = (e: GestureResponderEvent) => {
    if (closedPath) {
      setLastDragPosition({
        x: e.nativeEvent.locationX,
        y: e.nativeEvent.locationY,
      });
      return true;
    } else {
      return false;
    }
  };

  const handleResponderMove = (e: GestureResponderEvent) => {
    if (lastDragPosition) {
      const {x: lastX, y: lastY} = lastDragPosition;
      const {x: newX, y: newY} = {
        x: e.nativeEvent.locationX,
        y: e.nativeEvent.locationY,
      };

      const deltaX = newX - lastX;
      const deltaY = newY - lastY;

      setLastDragPosition({x: newX, y: newY});

      path.pop();
      updatePath(
        path.map(point =>
          roundPointCoordinates({
            x: point.x + deltaX,
            y: point.y + deltaY,
          }),
        ),
      );
    }
  };

  const points = path.map(({x, y}) => `${x},${y}`).join(' ');
  return (
    <Polyline
      points={points}
      fill="rgba(0,0,0,0)"
      stroke="white"
      strokeWidth="1.5"
      strokeDasharray="5"
      strokeDashoffset="0"
      onStartShouldSetResponder={handleStartShouldSetResponder}
      onResponderMove={handleResponderMove}
      onResponderEnd={updateCrop}
    />
  );
};

export default SvgPolyline;
