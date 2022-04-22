import cloneDeep from 'lodash/cloneDeep';
import { View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../../stores/hooks';
import { useCurrentSelectedCropContext } from '../context/CurrentSelectedCropContext';
import { useTrueImageSizeContext } from '../context/TrueImageSizeContext';
import {
  currentAnnotatedImageRemoveCrop,
  setCurrentAnnotatedImagePixels,
} from '../current-annotated-image';
import { Pixel } from '../types/image-annotation-types';
import { getAllPointsInPath } from '../utils/pixels-utils';
import DeleteButton from './DeleteButton';
import ValidateButton from './ValidateButton';

type CropContainerButtonsPropsType = {
  annotate: () => void;
};

const CropContainerButtons = ({ annotate }: CropContainerButtonsPropsType) => {
  //===========================================================================
  // Redux
  //===========================================================================

  const dispatch = useAppDispatch();

  const currentImage = useAppSelector(
    state => state.currentAnnotatedImage.annotatedImage,
  );

  //===========================================================================
  // Contexts
  //===========================================================================

  const { currentSelectedCrop, setCurrentSelectedCrop } =
    useCurrentSelectedCropContext();
  const { trueImageSize } = useTrueImageSizeContext();

  //===========================================================================
  // Functions
  //===========================================================================

  // TODO : See what this button must do
  const validateCrop = () => {
    annotate();
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

  //===========================================================================
  // Render
  //===========================================================================

  return (
    <View>
      <ValidateButton validateCrop={validateCrop} />
      <DeleteButton deleteCrop={deleteCrop} />
    </View>
  );
};

export default CropContainerButtons;
