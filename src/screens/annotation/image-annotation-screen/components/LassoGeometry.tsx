import { StyleSheet } from 'react-native';
import Svg from 'react-native-svg';
import { Point, Size } from '../types/image-annotation-types';
import { getPolygonPoints, getPolylinePoints } from '../utils/crop-utils';
import SvgPoint from './SvgPoint';
import SvgPolygon from './SvgPolygon';
import SvgPolyline from './SvgPolyline';

type LassoGeomertyProps = {
  displayedImageSize: Size;
  inCropCreation: boolean;
  closedPath: boolean;
  updatePath: (newPath: Point[]) => void;
  updateCrop: () => void;
  updatePointAtIndex: (idx: number, newPoint: Point) => void;
  handlePointPress: (idx: number) => void;
  path: Point[];
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
    <Svg
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
              updatePointAtIndex={(point: Point) =>
                updatePointAtIndex(idx, point)
              }
              updateCrop={() => updateCrop()}
              containerSize={displayedImageSize}
            />
          ))}
        </>
      )}
    </Svg>
  );
}

const styles = StyleSheet.create({
  pressableArea: {
    borderWidth: 1,
  },
});

export default LassoGeometry;
