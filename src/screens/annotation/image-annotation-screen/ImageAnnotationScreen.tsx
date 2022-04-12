import {useNavigation} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StackNavigationProp} from '@react-navigation/stack';
import {useEffect, useState} from 'react';
import {Button, Dimensions, Image, StyleSheet, View} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../app/hooks';
import {RootStackParamList} from '../../../types/navigation-types';
import AnnotationContainer from './components/AnnotationContainer';
import CropScrollView from './components/CropScrollView';
import {CurrentSelectedIndexCropContext} from './context/CurrentSelectedCropContext';
import {DisplayedImageSizeContext} from './context/DisplayedImageSizeContext';
import {TrueImageSizeContext} from './context/TrueImageSizeContext';
import {
  CurrentAnnotatedImageState,
  setCurrentAnnotatedImage,
  setCurrentAnnotatedImageSrc,
} from './current-annotated-image';
import {Size} from './types/image-annotation-types';

const windowWidth = Dimensions.get('window').width;

type ImageAnnotationScreenPropsType = NativeStackScreenProps<
  RootStackParamList,
  'ImageAnnotationScreen'
>;

const ImageAnnotationScreen = ({route}: ImageAnnotationScreenPropsType) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();

  const currentImagePixels = useAppSelector(
    (state: {currentAnnotatedImage: CurrentAnnotatedImageState}) => {
      return state.currentAnnotatedImage.annotatedImage.imagePixels;
    },
  );

  const {file} = route.params;

  const [displayedImageSize, setDisplayedImageSize] = useState<Size>();
  const [currentSelectedCropIndex, setCurrentSelectedCropIndex] =
    useState<number>();
  const [trueImageSize, setTrueImageSize] = useState<Size>();

  const changeDisplayedImageSize = (size: Size): void => {
    setDisplayedImageSize(size);
  };

  const changeCurrentSelectedCropIndex = (index?: number): void => {
    setCurrentSelectedCropIndex(index);
  };

  const changeTrueImageSize = (size: Size): void => {
    setTrueImageSize(size);
  };

  useEffect(() => {
    if (file.image) {
      dispatch(setCurrentAnnotatedImageSrc(file.image));
      Image.getSize(file.image, (width, height) => {
        const size = {width, height};
        setTrueImageSize(size);
      });
    }
  }, [currentImagePixels, dispatch, file.image]);

  return (
    <View style={styles.screen}>
      <View style={styles.annotation}>
        <View style={styles.home}>
          <Button
            title="Menu"
            onPress={() => {
              dispatch(
                setCurrentAnnotatedImage({
                  imageSource: '',
                  imagePixels: [],
                  imageCrops: [],
                }),
              );
              navigation.navigate('FileSelectionScreen', {});
            }}
          />
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
            <TrueImageSizeContext.Provider
              value={{trueImageSize, changeTrueImageSize}}>
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
