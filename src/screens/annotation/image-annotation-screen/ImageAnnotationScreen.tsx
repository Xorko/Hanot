import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { WebViewMessageEvent } from 'react-native-webview';
import { useAppDispatch } from '../../../stores/hooks';
import { RootStackParamList } from '../../../types/navigation-types';
import AnnotationContainer from './components/AnnotationContainer';
import CropScrollView from './components/CropScrollView';
import HomeButton from './components/HomeButton';
import PixelRecovery from './components/PixelRecovery';
import ProgressCircle from './components/ProgressCircle';
import { CurrentSelectedCropProvider } from './context/CurrentSelectedCropContext';
import { DisplayedImageSizeContextProvider } from './context/DisplayedImageSizeContext';
import { TrueImageSizeContextProvider } from './context/TrueImageSizeContext';
import {
  setCurrentAnnotatedImageFilePath,
  setCurrentAnnotatedImagePixels,
  setCurrentAnnotatedImageSrc,
  setCurrentAnnotatedImageWidth,
} from './current-annotated-image';
import type { Size } from './types/image-annotation-types';
import { getImagePixels } from './utils/pixel-utils.web';

const windowWidth = Dimensions.get('window').width;

type ImageAnnotationScreenPropsType = NativeStackScreenProps<
  RootStackParamList,
  'ImageAnnotationScreen'
>;

function ImageAnnotationScreen({ route }: ImageAnnotationScreenPropsType) {
  //===========================================================================
  // Navigation
  //===========================================================================

  // Gets the props from the navigation params
  const { file } = route.params;

  //===========================================================================
  // Redux functions
  //===========================================================================

  const dispatch = useAppDispatch();

  //===========================================================================
  // State
  //===========================================================================

  const [trueImageSize, setTrueImageSize] = useState<Size>();
  const [pixelRetrieved, setPixelRetrieved] = useState(false);

  //===========================================================================
  // Function
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
    <SafeAreaView style={styles.screen}>
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
      <View style={styles.annotation}>
        <View style={styles.home}>
          <HomeButton />
        </View>
        <DisplayedImageSizeContextProvider>
          <CurrentSelectedCropProvider>
            {trueImageSize && (
              <TrueImageSizeContextProvider
                initialTrueImageSize={trueImageSize}>
                {pixelRetrieved ? (
                  <>
                    <CropScrollView />
                    <AnnotationContainer />
                  </>
                ) : (
                  <ProgressCircle />
                )}
              </TrueImageSizeContextProvider>
            )}
          </CurrentSelectedCropProvider>
        </DisplayedImageSizeContextProvider>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  annotation: {
    flex: 1,
    width: windowWidth / 1.07,
    backgroundColor: '#e1e2e1',
    justifyContent: 'space-around',
    borderRadius: 40,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  screen: {
    height: '100%',
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  home: {
    position: 'absolute',
    right: 30,
    top: 30,
  },
  backgroundCanvas: {
    flex: 1,
    maxWidth: 1,
    maxHeight: 1,
  },
});

export default ImageAnnotationScreen;
