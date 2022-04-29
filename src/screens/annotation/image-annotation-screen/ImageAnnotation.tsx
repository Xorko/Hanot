import { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import { WebViewMessageEvent } from 'react-native-webview';
import { useAppDispatch } from '../../../stores/hooks';
import type { ImageFile } from '../../../types/file-import-types';
import AnnotationArea from '../components/AnnotationArea';
import Header from '../components/Header';
import AnnotationsContainer from './components/AnnotationsContainer';
import PixelRecovery from './components/PixelRecovery';
import ProgressCircle from './components/ProgressCircle';
import Workspace from './components/Workspace';
import { CurrentSelectedCropProvider } from './context/CurrentSelectedCropContext';
import { DisplayedImageSizeContextProvider } from './context/DisplayedImageSizeContext';
import { TrueImageSizeContextProvider } from './context/TrueImageSizeContext';
import {
  setCurrentAnnotatedImageFilePath,
  setCurrentAnnotatedImagePixels,
  setCurrentAnnotatedImageSrc,
  setCurrentAnnotatedImageWidth,
} from './current-annotated-image';
import { Size } from '../types/coordinates-types';
import { getImagePixels } from './utils/pixel-utils.web';

type ImageAnnotationProps = {
  file: ImageFile;
};

function ImageAnnotation({ file }: ImageAnnotationProps) {
  //===========================================================================
  // Redux functions
  //===========================================================================

  const dispatch = useAppDispatch();

  // const currentImage = useAppSelector(
  //   state => state.currentAnnotatedImage.annotatedImage,
  // );

  //===========================================================================
  // State
  //===========================================================================

  // The current image real size
  const [trueImageSize, setTrueImageSize] = useState<Size>();

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

  // const annotateImage = () => {
  //   const paths = currentImage.imageCrops
  //     ? currentImage.imageCrops.map((crop: Crop) => crop.cropPath)
  //     : [];
  //   const truePaths = getAdjustedPaths();
  // };

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
      <Header type="image" />
      <DisplayedImageSizeContextProvider>
        <CurrentSelectedCropProvider>
          {trueImageSize && (
            <TrueImageSizeContextProvider initialTrueImageSize={trueImageSize}>
              {pixelRetrieved ? (
                <>
                  <AnnotationsContainer />
                  <AnnotationArea>
                    <Workspace />
                  </AnnotationArea>
                </>
              ) : (
                <ProgressCircle />
              )}
            </TrueImageSizeContextProvider>
          )}
        </CurrentSelectedCropProvider>
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
