import { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useAppDispatch } from '../../../../stores/hooks';
import Annotation from '../../components/Annotation';
import { useCurrentSelectedCropContext } from '../context/CurrentSelectedCropContext';
import { useDisplayedImageSizeContext } from '../context/DisplayedImageSizeContext';
import { setCurrentAnnotatedImageCropAnnotationAtIndex } from '../current-annotated-image';
import type { Coordinates, Size } from '../../types/coordinates-types';
import {
  getExtremePointsOfPath,
  roundPointCoordinates,
} from '../utils/crop-utils';
import Crop from './Crop';

type AnnotationContainerProps = {
  path: Coordinates[];
  selectCrop: () => void;
  index: number;
};

function AnnotationContainer({
  path,
  index,
  selectCrop,
}: AnnotationContainerProps) {
  //===========================================================================
  // Redux
  //===========================================================================

  const dispatch = useAppDispatch();

  //===========================================================================
  // Contexts
  //===========================================================================

  const { displayedImageSize } = useDisplayedImageSizeContext();

  const { currentSelectedCrop } = useCurrentSelectedCropContext();

  //===========================================================================
  // State
  //===========================================================================

  // The path of the crop adjusted to the size of the container
  const [pathToDisplay, setPathToDisplay] = useState<Coordinates[]>();

  // The size of the crop adjusted to the size of the container
  const [cropSize, setCropSize] = useState<Size>();

  const [containerSize, setContainerSize] = useState<Size>();

  //===========================================================================
  // Functions
  //===========================================================================

  const handleInputChange = (text: string) => {
    dispatch(
      setCurrentAnnotatedImageCropAnnotationAtIndex({
        index,
        annotation: text,
      }),
    );
  };

  const getContainerSize = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  //===========================================================================
  // Render
  //===========================================================================

  /* Calcuates the path for the crop, in order to have the crop to fit in the container */
  useEffect(() => {
    if (containerSize) {
      // Get the size of the crop
      const { minX, minY, maxX, maxY } = getExtremePointsOfPath(path);
      const [cropWidth, cropHeight] = [maxX - minX, maxY - minY];

      // The size scale between the container and the crop
      const scale = Math.min(
        containerSize.width / cropWidth,
        containerSize.height / cropHeight,
      );

      // For all points in the path if the crop is larger than the container (scale < 1), the points needs to be scaled
      const newPath = path.map((point: Coordinates) => {
        return roundPointCoordinates({
          x: point.x * (scale < 1 ? scale : 1),
          y: point.y * (scale < 1 ? scale : 1),
        });
      });
      setPathToDisplay(newPath);

      // Same for the size of the crop, if the crop is larger than the container (scale < 1), the size needs to be scaled
      if (displayedImageSize) {
        const newSize = {
          width: displayedImageSize.width * (scale < 1 ? scale : 1),
          height: displayedImageSize.height * (scale < 1 ? scale : 1),
        };
        setCropSize(newSize);
      }
    }
  }, [containerSize, displayedImageSize, path]);

  return (
    <>
      <Annotation
        onInputChange={handleInputChange}
        onPress={selectCrop}
        selected={index === currentSelectedCrop}>
        <View style={styles.container} onLayout={getContainerSize}>
          {pathToDisplay && cropSize && (
            <Crop path={pathToDisplay} size={cropSize} />
          )}
        </View>
      </Annotation>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AnnotationContainer;
