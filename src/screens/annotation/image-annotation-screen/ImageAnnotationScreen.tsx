import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { useAppDispatch } from '../../../stores/hooks';
import { RootStackParamList } from '../../../types/navigation-types';
import AnnotationContainer from './components/AnnotationContainer';
import CropScrollView from './components/CropScrollView';
import HomeButton from './components/HomeButton';
import { CurrentSelectedCropProvider } from './context/CurrentSelectedCropContext';
import { DisplayedImageSizeContextProvider } from './context/DisplayedImageSizeContext';
import { TrueImageSizeContextProvider } from './context/TrueImageSizeContext';
import { setCurrentAnnotatedImageSrc } from './current-annotated-image';
import { Size } from './types/image-annotation-types';

const windowWidth = Dimensions.get('window').width;

type ImageAnnotationScreenPropsType = NativeStackScreenProps<
  RootStackParamList,
  'ImageAnnotationScreen'
>;

const ImageAnnotationScreen = ({ route }: ImageAnnotationScreenPropsType) => {
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
  // Contexts
  //===========================================================================

  const [trueImageSize, setTrueImageSize] = useState<Size>();

  /* Setting the image source in the store and the true image size. */
  useEffect(() => {
    if (file.image) {
      // Sets the image source in the store
      dispatch(setCurrentAnnotatedImageSrc(file.image));

      // Retrieves the image size and sets it in the state
      Image.getSize(file.image, (width, height) => {
        const size = { width, height };
        setTrueImageSize(size);
      });
    }
  }, [dispatch, file.image]);

  //===========================================================================
  // Render
  //===========================================================================

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.annotation}>
        <View style={styles.home}>
          <HomeButton />
        </View>
        <DisplayedImageSizeContextProvider>
          <CurrentSelectedCropProvider>
            {trueImageSize && (
              <TrueImageSizeContextProvider
                initialTrueImageSize={trueImageSize}>
                <CropScrollView />
                <AnnotationContainer />
              </TrueImageSizeContextProvider>
            )}
          </CurrentSelectedCropProvider>
        </DisplayedImageSizeContextProvider>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  annotation: {
    flex: 1,
    width: windowWidth / 1.07,
    backgroundColor: '#e1e2e1',
    alignItems: 'center',
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
    display: 'none',
  },
});

export default ImageAnnotationScreen;
