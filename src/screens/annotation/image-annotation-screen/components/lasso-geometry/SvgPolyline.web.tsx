import React, { MouseEvent, useState } from 'react';
import { useLassoModifiedContext } from '../../context/LassoModifiedContext';
import type { Point, Size } from '../../types/image-annotation-types';
import {
  getExtremePointsOfPath,
  roundPointCoordinates,
} from '../../utils/crop-utils';

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
  containerSize,
  updatePath,
  updateCrop,
}: SvgPolylinePropsType) {
  const { setLassoModified } = useLassoModifiedContext();

  const points = path.map(({ x, y }) => `${x},${y}`).join(' ');

  const [previousDragPosition, setPreviousDragPosition] = useState<Point>();

  const [isDragging, setIsDragging] = useState(false);

  const startDrag = (event: MouseEvent<SVGPolylineElement>) => {
    // A polyline can only be dragged if it is closed
    if (closedPath) {
      setLassoModified(true);
      setPreviousDragPosition({
        x: event.clientX,
        y: event.clientY,
      });
    }
  };

  const drag = (event: MouseEvent<SVGPolylineElement>) => {
    if (previousDragPosition && isDragging) {
      const { x: prevX, y: prevY } = previousDragPosition;
      const { x: currX, y: currY } = {
        x: event.clientX,
        y: event.clientY,
      };

      const deltaX = currX - prevX;
      const deltaY = currY - prevY;

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
        setPreviousDragPosition({ x: currX, y: currY });

        newPath.pop();
        updatePath(newPath);
      }
    }
  };

  const endDrag = () => {
    setPreviousDragPosition(undefined);
    setIsDragging(false);
    updateCrop();
  };

  return (
    <polyline
      points={points}
      fill="none"
      stroke="white"
      strokeWidth="1.5"
      strokeDasharray="5"
      strokeDashoffset="0"
      onMouseDown={startDrag}
      onMouseMove={drag}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}>
      <animate
        attributeName="stroke-dashoffset"
        values="0;1000;0"
        dur="100s"
        repeatCount="indefinite"
      />
    </polyline>
  );
}

export default SvgPolyline;
