import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputSubmitEditingEventData,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useAppDispatch} from '../../../../app/hooks';
import {useDisplayedImageSizeContext} from '../context/DisplayedImageSizeContext';
import {setCurrentAnnotatedImageCropAnnotationAtIndex} from '../current-annotated-image';
import {Point, Size} from '../types/image-annotation-types';
import {
  getExtremePointsOfPath,
  roundPointCoordinates,
} from '../utils/crop-utils';
import Crop from './Crop';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface CropContainerPropsType {
  path: Point[];
  selectCrop: () => void;
  selected: boolean;
  index: number;
}

const CropContainer = ({
  path,
  selectCrop,
  selected,
  index,
}: CropContainerPropsType) => {
  //===========================================================================
  // Redux
  //===========================================================================

  const dispatch = useAppDispatch();

  //===========================================================================
  // Contexts
  //===========================================================================

  const {displayedImageSize} = useDisplayedImageSizeContext();

  //===========================================================================
  // State
  //===========================================================================

  // The path of the crop adjusted to the size of the container
  const [pathToDisplay, setPathToDisplay] = useState<Point[]>();

  // The size of the crop adjusted to the size of the container
  const [sizeOfCrop, setSizeOfCrop] = useState<Size>();

  const [containerSize, setContainerSize] = useState<Size>();

  //===========================================================================
  // Functions
  //===========================================================================
  const handleLayout = (event: LayoutChangeEvent) => {
    const {width, height} = event.nativeEvent.layout;
    setContainerSize({width, height});
  };

  const handleTextSubmit = (
    /**
     * Sets the annotation of the crop being annotated to the submitted text
     * @param e The event that triggered the function
     */
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    dispatch(
      setCurrentAnnotatedImageCropAnnotationAtIndex({
        index,
        annotation: e.nativeEvent.text,
      }),
    );
  };

  /* Calcuates the path for the crop, in order to have the crop to fit in the container */
  useEffect(() => {
    if (containerSize) {
      // Get the size of the crop
      const {minX, minY, maxX, maxY} = getExtremePointsOfPath(path);
      const [cropWidth, cropHeight] = [maxX - minX, maxY - minY];

      // The size scale between the container and the crop
      const scale = Math.min(
        containerSize.width / cropWidth,
        containerSize.height / cropHeight,
      );

      // For all points in the path if the crop is larger than the container (scale < 1), the points needs to be scaled
      const newPath = path.map((point: Point) => {
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
        setSizeOfCrop(newSize);
      }
    }
  }, [containerSize, displayedImageSize, path]);
  return (
    //===========================================================================
    // Render
    //===========================================================================

    <TouchableOpacity activeOpacity={0.8} onPress={selectCrop}>
      <View
        style={selected ? {...styles.box, ...styles.seletedBox} : styles.box}>
        <View style={styles.letterWriting} onLayout={handleLayout}>
          {pathToDisplay && sizeOfCrop && (
            <Crop path={pathToDisplay} size={sizeOfCrop} />
          )}
        </View>
        <View style={styles.letterTitle}>
          <TextInput
            onSubmitEditing={handleTextSubmit}
            placeholder="Crop annotation"
            maxLength={1}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    alignSelf: 'center',
    backgroundColor: '#2196f3',
    height: windowHeight / 3,
    width: windowWidth / 7,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  seletedBox: {
    backgroundColor: '#607d8b',
  },
  letterWriting: {
    margin: 10,
    height: '70%',
    backgroundColor: '#6ec6ff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterTitle: {
    backgroundColor: '#6ec6ff',
    height: '18%',
    borderRadius: 10,
    marginBottom: 12,
    marginTop: 0,
    marginHorizontal: 60,
  },
});

export default CropContainer;
