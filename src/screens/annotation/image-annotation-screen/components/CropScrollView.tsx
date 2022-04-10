import {useContext} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useAppDispatch, useAppSelector} from '../../../../app/hooks';
import {CurrentSelectedIndexCropContext} from '../context/CurrentSelectedCropContext';
import {DisplayedImageSizeContext} from '../context/DisplayedImageSizeContext';
import {TrueImageSizeContext} from '../context/TrueImageSizeContext';
import {
  CurrentAnnotatedImageState,
  setCurrentAnnotatedImagePixels,
} from '../current-annotated-image';
import {Crop, Point} from '../types/image-annotation-types';
import {getAllPointsInPath} from '../utils/pixels-utils';
import CropContainer from './CropContainer';
import CropContainerButtons from './CropContainerButtons';
const cloneDeep = require('clone-deep');

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const CropScrollView = () => {
  const crops = useAppSelector(
    (state: {currentAnnotatedImage: CurrentAnnotatedImageState}) =>
      state.currentAnnotatedImage.annotatedImage.imageCrops,
  );
  const paths = crops ? crops.map((crop: Crop) => crop.cropPath) : [];
  const pixels = useAppSelector(
    (state: {currentAnnotatedImage: CurrentAnnotatedImageState}) =>
      state.currentAnnotatedImage.annotatedImage.imagePixels,
  );

  const dispatch = useAppDispatch();

  const {currentSelectedCropIndex, changeCurrentSelectedCropIndex} = useContext(
    CurrentSelectedIndexCropContext,
  );

  const {trueImageSize} = useContext(TrueImageSizeContext);
  const {displayedImageSize} = useContext(DisplayedImageSizeContext);

  const selectCrop = (index: number) => {
    changeCurrentSelectedCropIndex(index);
  };

  const getTruePaths = () => {
    if (trueImageSize && displayedImageSize) {
      const widthRatio = trueImageSize.width / displayedImageSize.width;
      const heightRatio = trueImageSize.height / displayedImageSize.height;

      return paths.map((path: Point[]) => {
        return path.map((point: Point) => {
          return {
            x: point.x * widthRatio,
            y: point.y * heightRatio,
          };
        });
      });
    }
  };

  const annotate = () => {
    changeCurrentSelectedCropIndex(undefined);
    const truePaths = getTruePaths();
    const pixelsCopy = cloneDeep(pixels);
    if (truePaths && trueImageSize) {
      truePaths.forEach((path: Point[], idx: number) => {
        const annotation = crops[idx].cropAnnotation;
        getAllPointsInPath(path, trueImageSize.width).forEach(
          (index: number) => {
            const pixel = pixelsCopy[index];
            if (pixel.color !== 'ffffff') {
              pixel.annotation = annotation;
            }
          },
        );
      });
      dispatch(setCurrentAnnotatedImagePixels(pixelsCopy));
    }
  };

  return (
    <View style={styles.box}>
      <ScrollView horizontal contentContainerStyle={styles.scroll}>
        {paths.map((path, idx) => (
          <CropContainer
            key={idx}
            path={path}
            selectCrop={() => selectCrop(idx)}
            selected={idx === currentSelectedCropIndex}
            index={idx}
          />
        ))}
      </ScrollView>
      <CropContainerButtons
        currentSelectedCrop={currentSelectedCropIndex}
        annotate={annotate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    flex: 1,
    flexDirection: 'row',
    height: windowHeight / 2.5,
    width: windowWidth / 1.5,
    alignItems: 'center',
    marginRight: '2.7%',
  },
  scroll: {
    backgroundColor: '#e1e2e1',
    flexGrow: 1,
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttons: {
    backgroundColor: '#e1e2e1',
    height: windowHeight / 3,
    width: 1,
  },
});

export default CropScrollView;
