import React, { useState } from 'react';
import { GestureResponderEvent } from 'react-native';
import { Rect } from 'react-native-svg';
import { Point, Size } from '../types/image-annotation-types';
import { roundPointCoordinates } from '../utils/crop-utils';

interface SvgPointPropsType {
  point: Point;
  idx: number;
  onPress: (idx: number) => void;
  closedPath: boolean;
  updatePointAtIndex: (newPoint: Point) => void;
  updateCrop: () => void;
  containerSize: Size;
}

const SvgPoint = ({
  point,
  idx,
  onPress,
  closedPath,
  updatePointAtIndex,
  updateCrop,
  containerSize,
}: SvgPointPropsType) => {
  //===========================================================================
  // State
  //===========================================================================

  // The previous position of the point
  const [previousDragPosition, setPreviousDragPosition] = useState<Point>();

  //===========================================================================
  // Variables
  //===========================================================================

  // Coordinates of the point
  const { x, y } = point;

  // Size of the point, that depends on if it is the first point or not
  const { width, height } =
    idx === 0 ? { width: 15, height: 15 } : { width: 10, height: 10 };

  //===========================================================================
  // Functions
  //===========================================================================

  /**
   * Allow or deny the dragging of the point
   * @param e The event that is triggered when the user tries to drag the point
   * @returns True if the point can be dragged, false otherwise
   */
  const handleStartShouldSetResponder = (e: GestureResponderEvent) => {
    setPreviousDragPosition({
      x: e.nativeEvent.locationX,
      y: e.nativeEvent.locationY,
    });
    return true;
  };

  /**
   * Called if the drag is allowed
   */
  const handleResponderGrant = () => {
    if (!closedPath) {
      // If the path is not closed, the point is not dragged but pressed
      onPress(idx);
    }
  };

  /**
   * Handle the dragging of the point
   * @param e The event that is triggered when the user drags the point
   */
  const handleResponderMove = (e: GestureResponderEvent) => {
    if (previousDragPosition) {
      const { x: prevX, y: prevY } = previousDragPosition;
      const { x: newX, y: newY } = {
        x: e.nativeEvent.locationX,
        y: e.nativeEvent.locationY,
      };

      if (
        newX < 0 ||
        newY < 0 ||
        newX > containerSize.width ||
        newY > containerSize.height
      ) {
        // If the point is dragged outside the container, it is not dragged
        return;
      }

      const deltaX = newX - prevX;
      const deltaY = newY - prevY;

      setPreviousDragPosition({ x: newX, y: newY });
      updatePointAtIndex(
        roundPointCoordinates({ x: x + deltaX, y: y + deltaY }),
      );
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
