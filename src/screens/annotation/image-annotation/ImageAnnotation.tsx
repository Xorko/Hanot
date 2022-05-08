import { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { WebViewMessageEvent } from 'react-native-webview';
import { addAnnotatedImage } from '../../../shared/annotated-image-files-slice';
import { useAppDispatch, useAppSelector } from '../../../stores/hooks';
import { Size } from '../../../types/coordinates-types';
import type { ImageFile } from '../../../types/file-import-types';
import AnnotationArea from '../components/AnnotationArea';
import Header from '../components/Header';
import { SelectedBoxProvider } from '../context/SelectedBoxContext';
import AnnotationsContainer from './components/AnnotationsContainer';
import PixelRecovery from './components/PixelRecovery';
import ProgressCircle from './components/ProgressCircle';
import Workspace from './components/Workspace';
import { DisplayedImageSizeContextProvider } from './context/DisplayedImageSizeContext';
import {
  resetCurrentAnnotatedImage,
  setCurrentAnnotatedId,
  setCurrentAnnotatedImage,
  setCurrentAnnotatedImageCrops,
  setCurrentAnnotatedImagePixels,
  setCurrentAnnotatedImageSize,
  setCurrentAnnotatedImageSrc,
} from './current-annotated-image';
import { Crop } from './types/image-annotation-types';
import { getAdjustedPaths, makeAnnotation } from './utils/annotation-utils';
import { getImagePixels } from './utils/pixel-utils.web';

type ImageAnnotationProps = {
  file: ImageFile;
};

function ImageAnnotation({ file }: ImageAnnotationProps) {
  //===========================================================================
  // Redux functions
  //===========================================================================

  const dispatch = useAppDispatch();

  const currentImage = useAppSelector(state => state.currentAnnotatedImage);

  const annotatedImage = useAppSelector(state =>
    state.annotatedImages.annotatedImages.find(image => image.id === file.id),
  );

  const trueImageSize = useAppSelector(
    state => state.currentAnnotatedImage.imageSize,
  );

  //===========================================================================
  // State
  //===========================================================================

  // The current image displayed size
  const [displayedImageSize, setDisplayedImageSize] = useState<Size>();

  // Indicates if the image pixels have been retrieved
  const [pixelRetrieved, setPixelRetrieved] = useState(false);

  const [isAnnotated, setIsAnnotated] = useState<boolean>(false);

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

      if (truePaths && trueImageSize) {
        // Updates the pixels of the image in the redux store
        dispatch(
          setCurrentAnnotatedImagePixels(
            makeAnnotation(currentImage, truePaths, trueImageSize.width),
          ),
        );

        setIsAnnotated(true);

        // Shows a toast message to inform the user that the image has been annotated
        Toast.show({
          type: 'success',
          text1: 'Annotation validée',
          visibilityTime: 1000,
        });
      }
    }
  };

  const onGoBack = () => {
    if (isAnnotated) {
      dispatch(addAnnotatedImage(currentImage));
    }

    dispatch(resetCurrentAnnotatedImage());
  };

  const onDrawerOpen = () => {
    if (isAnnotated) {
      dispatch(addAnnotatedImage(currentImage));
    }
  };

  //===========================================================================
  // Render
  //===========================================================================

  useEffect(() => {
    setIsAnnotated(false);
    if (annotatedImage !== undefined) {
      dispatch(setCurrentAnnotatedImage(annotatedImage));
      setPixelRetrieved(true);
    } else {
      if (file.image && file.id) {
        // Sets the image source in the store
        dispatch(setCurrentAnnotatedImageSrc(file.image));
        dispatch(setCurrentAnnotatedId(file.id));
        dispatch(setCurrentAnnotatedImageCrops([]));

        // Retrieves the image size and sets it in the state
        Image.getSize(file.image, (width, height) => {
          const size = { width, height };
          dispatch(setCurrentAnnotatedImageSize(size));
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
    }
  }, [annotatedImage, dispatch, file.id, file.image]);

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
      <Header
        onGoBack={onGoBack}
        onValidate={annotateImage}
        onDrawerOpen={onDrawerOpen}
      />
      <DisplayedImageSizeContextProvider>
        <SelectedBoxProvider initialSelectedBox={undefined}>
          {trueImageSize && (
            <>
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
            </>
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
