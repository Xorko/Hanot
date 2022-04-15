import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useEffect, useState} from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import {useAppDispatch} from '../../../app/hooks';
import {RootStackParamList} from '../../../types/navigation-types';
import AnnotationContainer from './components/AnnotationContainer';
import CropScrollView from './components/CropScrollView';
import HomeButton from './components/HomeButton';
import {CurrentSelectedIndexCropContext} from './context/CurrentSelectedCropContext';
import {DisplayedImageSizeContext} from './context/DisplayedImageSizeContext';
import {TrueImageSizeContext} from './context/TrueImageSizeContext';
import {setCurrentAnnotatedImageSrc} from './current-annotated-image';
import {Size} from './types/image-annotation-types';

const windowWidth = Dimensions.get('window').width;

type ImageAnnotationScreenPropsType = NativeStackScreenProps<
  RootStackParamList,
  'ImageAnnotationScreen'
>;

const ImageAnnotationScreen = ({route}: ImageAnnotationScreenPropsType) => {
  //===========================================================================
  // Navigation
  //===========================================================================

  // Gets the props from the navigation params
  const {file} = route.params;

  //===========================================================================
  // Redux functions
  //===========================================================================

  const dispatch = useAppDispatch();

  //===========================================================================
  // Setup of the values for the contexts
  //===========================================================================

  // The size of the image as it is displayed on the screen
  const [displayedImageSize, setDisplayedImageSize] = useState<Size>();
  // The real size of the image
  const [trueImageSize, setTrueImageSize] = useState<Size>();
  // The index of the crop that is currently selected
  const [currentSelectedCropIndex, setCurrentSelectedCropIndex] =
    useState<number>();

  /**
   * Updates the displayed image size with the new size
   * @param size The new size of the image
   */
  const changeDisplayedImageSize = (size: Size): void => {
    setDisplayedImageSize(size);
  };

  /**
   * Updates the current selected crop index with the new index
   * @param index The index of the new crop that is selected
   */
  const changeCurrentSelectedCropIndex = (index?: number): void => {
    setCurrentSelectedCropIndex(index);
  };

  /* Setting the image source in the store and the true image size. */
  useEffect(() => {
    if (file.image) {
      // Sets the image source in the store
      dispatch(setCurrentAnnotatedImageSrc(file.image));

      // Retrieves the image size and sets it in the state
      Image.getSize(file.image, (width, height) => {
        const size = {width, height};
        setTrueImageSize(size);
      });
    }
  }, [dispatch, file.image]);

  //===========================================================================
  // Render
  //===========================================================================

  return (
    <View style={styles.screen}>
      <View style={styles.annotation}>
        <View style={styles.home}>
          <HomeButton />
        </View>
        <DisplayedImageSizeContext.Provider
          value={{
            displayedImageSize,
            changeDisplayedImageSize,
          }}>
          <CurrentSelectedIndexCropContext.Provider
            value={{
              currentSelectedCropIndex,
              changeCurrentSelectedCropIndex,
            }}>
            <TrueImageSizeContext.Provider value={{trueImageSize}}>
              <CropScrollView />
              <AnnotationContainer />
            </TrueImageSizeContext.Provider>
          </CurrentSelectedIndexCropContext.Provider>
        </DisplayedImageSizeContext.Provider>
      </View>
    </View>
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
