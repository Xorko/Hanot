import cloneDeep from 'lodash/cloneDeep';
import { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { addAnnotatedImage } from '../../../../shared/annotated-image-files-slice';
import { useAppDispatch, useAppSelector } from '../../../../stores/hooks';
import { useCurrentSelectedCropContext } from '../context/CurrentSelectedCropContext';
import { useDisplayedImageSizeContext } from '../context/DisplayedImageSizeContext';
import { useTrueImageSizeContext } from '../context/TrueImageSizeContext';
import {
  currentAnnotatedImageRemoveCrop,
  setCurrentAnnotatedImagePixels,
} from '../current-annotated-image';
import type { Crop, Pixel } from '../types/image-annotation-types';
import { Coordinates } from '../../types/coordinates-types';
import { getAllPointsInPath } from '../utils/pixels-utils';
import CropContainer from './CropContainer';
import CropContainerButtons from './CropContainerButtons';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

/* Scroll view that will contain all the crops created */
function CropScrollView() {
  //===========================================================================
  // Redux
  //===========================================================================

  const currentImage = useAppSelector(
    state => state.currentAnnotatedImage.annotatedImage,
  );

  const dispatch = useAppDispatch();

  //===========================================================================
  // Contexts
  //===========================================================================

  const { trueImageSize } = useTrueImageSizeContext();
  const { displayedImageSize } = useDisplayedImageSizeContext();

  const { currentSelectedCrop, setCurrentSelectedCrop } =
    useCurrentSelectedCropContext();

  //===========================================================================
  // State
  // ===========================================================================

  const [isAnnotated, setIsAnnotated] = useState<boolean>(false);

  //===========================================================================
  // Variables
  //===========================================================================

  // Varible that will contain all the paths of all the crops to display
  const paths = currentImage.imageCrops
    ? currentImage.imageCrops.map((crop: Crop) => crop.cropPath)
    : [];

  //===========================================================================
  // Functions
  //===========================================================================

  /**
   * Changes the current selected crop index with the new index
   * @param index The index of the crop that is selected
   */
  const selectCrop = (index: number) => {
    setCurrentSelectedCrop(index);
  };

  /**
   * Removes the crop from the redux store
   */
  const deleteCrop = () => {
    if (currentSelectedCrop !== undefined && trueImageSize) {
      const pixelsCopy: Pixel[] = cloneDeep(currentImage.imagePixels);

      getAllPointsInPath(
        currentImage.imageCrops[currentSelectedCrop].cropPath,
        trueImageSize.width,
      ).forEach((index: number) => {
        // For every point, sets the annotation of the corresponding pixel to the one of the crop, if the pixel is not white (background)
        const pixel: Pixel = pixelsCopy[index];
        pixel.annotation = undefined;
      });

      dispatch(currentAnnotatedImageRemoveCrop(currentSelectedCrop));
      dispatch(setCurrentAnnotatedImagePixels(pixelsCopy));
      setCurrentSelectedCrop(undefined);
    }
  };

  /**
   * Calculates the paths adjusted to the real image size
   * @returns The paths adjusted to the real image size
   */
  const getAdjustedPaths = () => {
    if (trueImageSize && displayedImageSize) {
      const widthRatio = trueImageSize.width / displayedImageSize.width;
      const heightRatio = trueImageSize.height / displayedImageSize.height;

      return paths.map((path: Coordinates[]) => {
        return path.map((point: Coordinates) => {
          return {
            x: point.x * widthRatio,
            y: point.y * heightRatio,
          };
        });
      });
    }
  };

  /**
   * Gives every pixel of the image its annotation corresponding to the crop it is part of
   */
  const annotate = () => {
    // Unselects crops if one is selected
    setCurrentSelectedCrop(undefined);

    const truePaths = getAdjustedPaths();

    // Copies the pixels to a new array to be able to modify it
    const pixelsCopy: Pixel[] = cloneDeep(currentImage.imagePixels);

    if (truePaths && trueImageSize) {
      // Map that counts the letters occurences
      const lettersMap: Map<string, number> = new Map();

      truePaths.forEach((path: Coordinates[], idx: number) => {
        // For every crop, gets the crop annotation
        const annotation = currentImage.imageCrops[idx].cropAnnotation;

        // Updates the letters map with the crop annotation
        if (annotation) {
          const letterOccurences = lettersMap.get(annotation);
          lettersMap.set(
            annotation,
            letterOccurences ? letterOccurences + 1 : 1,
          );
        }

        // Then gets all points that are on and in the path
        getAllPointsInPath(path, trueImageSize.width).forEach(
          (index: number) => {
            // For every point, sets the annotation of the corresponding pixel to the one of the crop, if the pixel is not white (background)
            const pixel: Pixel = pixelsCopy[index];
            // If the pixel is not white (background)
            if (pixel.color !== '#FFFFFF') {
              if (annotation) {
                // If the crop has an annotation, annotates the pixel with the annotation and the occurence of the annotation
                const occ = lettersMap.get(annotation);
                pixel.annotation = `${annotation}-${occ}`;
              } else {
                // If the crop has no annotation, the annotation will be considered to be undefined
                pixel.annotation = 'undefined';
              }
            }
          },
        );
      });

      // Updates the pixels of the image in the redux store
      dispatch(setCurrentAnnotatedImagePixels(pixelsCopy));

      setIsAnnotated(true);
    }
  };

  useEffect(() => {
    if (isAnnotated) {
      // If the image is annotated, adds it to the annotated image files
      dispatch(addAnnotatedImage(currentImage));

      // Shows a toast message to inform the user that the image has been annotated
      Toast.show({
        type: 'success',
        text1: 'Image successfully annotated',
        visibilityTime: 1000,
      });
    }
  }, [currentImage, dispatch, isAnnotated]);

  //===========================================================================
  // Render
  //===========================================================================

  return (
    <View style={styles.box}>
      <ScrollView horizontal contentContainerStyle={styles.scroll}>
        {paths.map((path, idx) => (
          <CropContainer
            key={idx}
            path={path}
            selectCrop={() => selectCrop(idx)}
            selected={idx === currentSelectedCrop}
            index={idx}
          />
        ))}
      </ScrollView>
      <CropContainerButtons annotate={annotate} deleteCrop={deleteCrop} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    flexDirection: 'row',
    height: windowHeight / 2.5,
    width: windowWidth / 1.5,
    alignSelf: 'center',
    marginRight: '2.7%',
  },
  scroll: {
    backgroundColor: '#e1e2e1',
    flexGrow: 1,
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },
  buttons: {
    backgroundColor: '#e1e2e1',
    height: windowHeight / 3,
    width: 1,
  },
});

export default CropScrollView;