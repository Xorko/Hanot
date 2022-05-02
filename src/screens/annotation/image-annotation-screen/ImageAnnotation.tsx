import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { WebViewMessageEvent } from 'react-native-webview';
import { addAnnotatedImage } from '../../../shared/annotated-image-files-slice';
import { useAppDispatch, useAppSelector } from '../../../stores/hooks';
import type { ImageFile } from '../../../types/file-import-types';
import AnnotationArea from '../components/AnnotationArea';
import Header from '../components/Header';
import { SelectedBoxProvider } from '../context/SelectedBoxContext';
import { Coordinates, Size } from '../types/coordinates-types';
import AnnotationsContainer from './components/AnnotationsContainer';
import PixelRecovery from './components/PixelRecovery';
import ProgressCircle from './components/ProgressCircle';
import Workspace from './components/Workspace';
import { DisplayedImageSizeContextProvider } from './context/DisplayedImageSizeContext';
import { TrueImageSizeContextProvider } from './context/TrueImageSizeContext';
import {
  initialState,
  setCurrentAnnotatedImage,
  setCurrentAnnotatedImageFilePath,
  setCurrentAnnotatedImagePixels,
  setCurrentAnnotatedImageSrc,
  setCurrentAnnotatedImageWidth,
} from './current-annotated-image';
import { Crop, Pixel } from './types/image-annotation-types';
import { getAdjustedPaths } from './utils/annotation-utils';
import { getImagePixels } from './utils/pixel-utils.web';
import { getAllPointsInPath } from './utils/pixels-utils';

type ImageAnnotationProps = {
  file: ImageFile;
};

function ImageAnnotation({ file }: ImageAnnotationProps) {
  //===========================================================================
  // Redux functions
  //===========================================================================

  const dispatch = useAppDispatch();

  const currentImage = useAppSelector(
    state => state.currentAnnotatedImage.annotatedImage,
  );

  //===========================================================================
  // State
  //===========================================================================

  // The current image real size
  const [trueImageSize, setTrueImageSize] = useState<Size>();

  // The current image displayed size
  const [displayedImageSize, setDisplayedImageSize] = useState<Size>();

  // Indicates if the image pixels have been retrieved
  const [pixelRetrieved, setPixelRetrieved] = useState(false);

  //===========================================================================
  // Functions
  //===========================================================================

  /**
   * Receive the message from the webview and set the pixels in the store.
   * @param event Event from the webview
   */
  const handleWebviewMessages = (event: WebViewMessageEvent) => {
    const pixelMap = event.nativeEvent.data.split(',').map((pixel: string) => {
      if (pixel === 'w') {
        return { color: '#FFFFFF', annotation: 'background' };
      } else if (pixel === 'b') {
        return { color: '#000000', annotation: undefined };
      } else {
        return { color: `#${pixel.toUpperCase()}`, annotation: undefined };
      }
    });

    dispatch(setCurrentAnnotatedImagePixels(pixelMap));

    setPixelRetrieved(true);
  };

  const annotateImage = () => {
    if (trueImageSize && displayedImageSize) {
      const paths = currentImage.imageCrops
        ? currentImage.imageCrops.map((crop: Crop) => crop.cropPath)
        : [];

      const truePaths = getAdjustedPaths(
        trueImageSize,
        displayedImageSize,
        paths,
      );

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

        // Shows a toast message to inform the user that the image has been annotated
        Toast.show({
          type: 'success',
          text1: 'Image successfully annotated',
          visibilityTime: 1000,
        });
      }
    }
  };

  const onGoBack = () => {
    dispatch(addAnnotatedImage(currentImage));
    dispatch(setCurrentAnnotatedImage(initialState.annotatedImage));
  };

  //===========================================================================
  // Render
  //===========================================================================

  /* Setting the image source in the store and the true image size. */
  useEffect(() => {
    if (file.image && file.id) {
      // Sets the image source in the store
      dispatch(setCurrentAnnotatedImageSrc(file.image));
      dispatch(setCurrentAnnotatedImageFilePath(file.id));

      // Retrieves the image size and sets it in the state
      Image.getSize(file.image, (width, height) => {
        const size = { width, height };
        setTrueImageSize(size);
        dispatch(setCurrentAnnotatedImageWidth(size.width));
      });

      Platform.OS === 'web' &&
        getImagePixels(file.image, (err, pixels) => {
          if (err) {
            console.error(err);
          } else {
            dispatch(setCurrentAnnotatedImagePixels(pixels));

            setPixelRetrieved(true);
          }
        });
    }
  }, [dispatch, file.id, file.image]);

  return (
    <View style={styles.container}>
      {trueImageSize && !pixelRetrieved && file.image && (
        <View style={styles.backgroundCanvas}>
          {Platform.OS !== 'web' && (
            <PixelRecovery
              imageSize={trueImageSize}
              imageSrc={file.image}
              handleWebviewMessages={handleWebviewMessages}
            />
          )}
        </View>
      )}
      <Header type="image" onGoBack={onGoBack} onValidate={annotateImage} />
      <DisplayedImageSizeContextProvider>
        <SelectedBoxProvider initialSelectedBox={undefined}>
          {trueImageSize && (
            <TrueImageSizeContextProvider initialTrueImageSize={trueImageSize}>
              {pixelRetrieved ? (
                <>
                  <AnnotationsContainer />
                  <AnnotationArea>
                    <Workspace
                      pullUpDisplayedImageSize={(displayedSize: Size) =>
                        setDisplayedImageSize(displayedSize)
                      }
                    />
                  </AnnotationArea>
                </>
              ) : (
                <ProgressCircle />
              )}
            </TrueImageSizeContextProvider>
          )}
        </SelectedBoxProvider>
      </DisplayedImageSizeContextProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    flex: 1,
  },
  backgroundCanvas: {
    flex: 1,
    maxWidth: 1,
    maxHeight: 1,
  },
});

export default ImageAnnotation;
