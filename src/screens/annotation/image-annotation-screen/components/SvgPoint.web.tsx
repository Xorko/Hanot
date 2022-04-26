import React, { MouseEvent, useState } from 'react';
import { useLassoModifiedContext } from '../context/LassoModifiedContext';
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
  updatePointAtIndex,
  updateCrop,
  containerSize,
  closedPath,
  onPress,
}: SvgPointPropsType) => {
  //===========================================================================
  // Context
  //===========================================================================

  const { setLassoModified } = useLassoModifiedContext();

  //===========================================================================
  // State
  //===========================================================================

  // The previous position of the point
  const [previousDragPosition, setPreviousDragPosition] = useState<Point>();

  const [isDragging, setIsDragging] = useState(false);

  //===========================================================================
  // Variables
  //===========================================================================

  // Coordinates of the point
  const { x, y } = point;

  // Size of the point, that depends on if it is the first point or not
  const { width, height } =
    idx === 0 ? { width: 15, height: 15 } : { width: 10, height: 10 };

  /**
   * Begin dragging the point
   * @param event Mouse event that triggered the drag
   */
  const startDrag = (event: MouseEvent<SVGRectElement>) => {
    // If the path is closed, w
    if (closedPath) {
      event.stopPropagation();
      setPreviousDragPosition({
        x: event.clientX,
        y: event.clientY,
      });

      setIsDragging(true);
      setLassoModified(true);
    } else {
      onPress(idx);
    }
  };

  const drag = (event: MouseEvent<SVGRectElement>) => {
    if (previousDragPosition && isDragging) {
      event.preventDefault();

      const { x: prevX, y: prevY } = previousDragPosition;
      const { x: currX, y: currY } = {
        x: event.clientX,
        y: event.clientY,
      };

      const newPoint = {
        x: x + currX - prevX,
        y: y + currY - prevY,
      };

      if (newPoint.x < 0) {
        newPoint.x = 0;
      } else if (newPoint.x > containerSize.width) {
        newPoint.x = containerSize.width;
      }

      if (newPoint.y < 0) {
        newPoint.y = 0;
      } else if (newPoint.y > containerSize.height) {
        newPoint.y = containerSize.height;
      }

      setPreviousDragPosition({ x: currX, y: currY });

      // Update the point
      updatePointAtIndex(roundPointCoordinates(newPoint));
    }
  };

  const endDrag = () => {
    setPreviousDragPosition(undefined);
    setIsDragging(false);
    updateCrop();
  };

  return (
    <rect
      x={x - width / 2}
      y={y - height / 2}
      width={width}
      height={height}
      fill="rgba(0, 0, 0, 0)"
      stroke="white"
      strokeWidth="1.25"
      onMouseDown={startDrag}
      onMouseMove={drag}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
    />
  );
};

export default SvgPoint;
