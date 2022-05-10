import { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, TextInput, View } from 'react-native';
import { useAppDispatch } from '../../../../stores/hooks';
import type { Coordinates, Size } from '../../../../types/coordinates-types';
import AnnotationCard from '../../components/AnnotationCard';
import { useSelectedBox } from '../../context/SelectedBoxContext';
import { useDisplayedImageSizeContext } from '../context/DisplayedImageSizeContext';
import { setCurrentAnnotatedImageCropAnnotationAtIndex } from '../current-annotated-image';
import {
  getExtremePointsOfPath,
  roundPointCoordinates,
} from '../utils/crop-utils';
import Crop from './Crop';

type AnnotationContainerProps = {
  path: Coordinates[];
  selectCrop: () => void;
  index: number;
  isNoise: boolean;
  inputRefs: React.MutableRefObject<TextInput[]>;
  insertIntoInputRefs: (ref: TextInput, index: number) => void;
};

function AnnotationCardContainer({
  path,
  index,
  selectCrop,
  isNoise,
  insertIntoInputRefs,
  inputRefs,
}: AnnotationContainerProps) {
  //===========================================================================
  // Redux
  //===========================================================================

  const dispatch = useAppDispatch();

  //===========================================================================
  // Contexts
  //===========================================================================

  const { displayedImageSize } = useDisplayedImageSizeContext();

  const { selectedBox, setSelectedBox } = useSelectedBox();

  //===========================================================================
  // State
  //===========================================================================

  // The path of the crop adjusted to the size of the container
  const [pathToDisplay, setPathToDisplay] = useState<Coordinates[]>();

  // The size of the crop adjusted to the size of the container
  const [cropSize, setCropSize] = useState<Size>();

  // The size of the container
  const [containerSize, setContainerSize] = useState<Size>();

  //===========================================================================
  // Functions
  //===========================================================================

  const handleInputChange = (text: string) => {
    if (inputRefs.current && inputRefs.current[index + 1] && text !== '') {
      inputRefs.current[index + 1].focus();
    }

    dispatch(
      setCurrentAnnotatedImageCropAnnotationAtIndex({
        index,
        annotation: text,
      }),
    );
    setSelectedBox(undefined);
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

      const isScaled = scale < 1 ? scale : 1;

      // For all points in the path if the crop is larger than the container (scale < 1), the points needs to be scaled
      const newPath = path.map((point: Coordinates) => {
        return roundPointCoordinates({
          x: point.x * isScaled,
          y: point.y * isScaled,
        });
      });
      setPathToDisplay(newPath);

      // Same for the size of the crop, if the crop is larger than the container (scale < 1), the size needs to be scaled
      if (displayedImageSize) {
        const newSize = {
          width: displayedImageSize.width * isScaled,
          height: displayedImageSize.height * isScaled,
        };
        setCropSize(newSize);
      }
    }
  }, [containerSize, displayedImageSize, path]);

  return (
    <>
      <AnnotationCard
        index={index}
        onInputChange={handleInputChange}
        onPress={selectCrop}
        isSelected={index === selectedBox}
        backgroundColor="#C5CAE9"
        isNoise={isNoise}
        insertIntoInputRefs={insertIntoInputRefs}>
        <View style={styles.container} onLayout={getContainerSize}>
          {pathToDisplay && cropSize && (
            <Crop path={pathToDisplay} size={cropSize} />
          )}
        </View>
      </AnnotationCard>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AnnotationCardContainer;
