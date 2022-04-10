import React, {useState} from 'react';
import {GestureResponderEvent} from 'react-native';
import {Rect} from 'react-native-svg';
import {Point} from '../types/image-annotation-types';
import {roundPointCoordinates} from '../utils/crop-utils';

interface SvgPointPropsType {
  point: Point;
  idx: number;
  onPress: (idx: number) => void;
  closedPath: boolean;
  updatePointAtIndex: (newPoint: Point) => void;
  updateCrop: () => void;
}

const SvgPoint = ({
  point,
  idx,
  onPress,
  closedPath,
  updatePointAtIndex,
  updateCrop,
}: SvgPointPropsType) => {
  const {x, y} = point;
  const {width, height} =
    idx === 0 ? {width: 15, height: 15} : {width: 10, height: 10};

  const [lastDragPosition, setLastDragPosition] = useState<Point>();

  const handleStartShouldSetResponder = (e: GestureResponderEvent) => {
    setLastDragPosition({
      x: e.nativeEvent.locationX,
      y: e.nativeEvent.locationY,
    });
    return true;
  };

  const handleResponderGrant = () => {
    if (!closedPath) {
      onPress(idx);
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
      updatePointAtIndex(roundPointCoordinates({x: x + deltaX, y: y + deltaY}));
    }
  };

  return (
    <Rect
      x={x - 5}
      y={y - 5}
      width={width}
      height={height}
      fill="rgba(0, 0, 0, 0)"
      stroke="white"
      strokeWidth="1.25"
      onStartShouldSetResponder={handleStartShouldSetResponder}
      onResponderGrant={handleResponderGrant}
      onResponderMove={handleResponderMove}
      onResponderEnd={updateCrop}
    />
  );
};

export default SvgPoint;
