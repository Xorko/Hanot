import { StyleSheet } from 'react-native';
import type { Size } from '../types/image-annotation-types';
import { Coordinates } from '../../types/coordinates-types';
import { getPolygonPoints, getPolylinePoints } from '../utils/crop-utils';
import SvgPoint from './SvgPoint';
import SvgPolygon from './SvgPolygon';
import SvgPolyline from './SvgPolyline';

type LassoGeomertyProps = {
  displayedImageSize: Size;
  inCropCreation: boolean;
  closedPath: boolean;
  updatePath: (newPath: Coordinates[]) => void;
  updateCrop: () => void;
  updatePointAtIndex: (idx: number, newPoint: Coordinates) => void;
  handlePointPress: (idx: number) => void;
  path: Coordinates[];
};

function LassoGeometry({
  displayedImageSize,
  inCropCreation,
  closedPath,
  updatePath,
  updateCrop,
  updatePointAtIndex,
  handlePointPress,
  path,
}: LassoGeomertyProps) {
  return (
    <svg
      style={{
        ...styles.pressableArea,
        width: displayedImageSize.width,
        height: displayedImageSize.height,
      }}>
      {inCropCreation && !!path.length && (
        <>
          <SvgPolygon
            path={getPolygonPoints(displayedImageSize, path, closedPath)}
          />
          <SvgPolyline
            path={getPolylinePoints(path, closedPath)}
            closedPath={closedPath}
            updatePath={updatePath}
            updateCrop={updateCrop}
            containerSize={displayedImageSize}
          />
          {path.map(({ x, y }, idx) => (
            <SvgPoint
              key={idx}
              point={{ x, y }}
              idx={idx}
              onPress={handlePointPress}
              closedPath={closedPath}
              updatePointAtIndex={(point: Coordinates) =>
                updatePointAtIndex(idx, point)
              }
              updateCrop={() => updateCrop()}
              containerSize={displayedImageSize}
            />
          ))}
        </>
      )}
    </svg>
  );
}

const styles = StyleSheet.create({
  pressableArea: {
    borderWidth: 1,
  },
});

export default LassoGeometry;
