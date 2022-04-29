import { cloneDeep } from 'lodash';
import { useAppDispatch, useAppSelector } from '../../../../stores/hooks';
import Annotations from '../../components/Annotations';
import { useCurrentSelectedCropContext } from '../context/CurrentSelectedCropContext';
import { useTrueImageSizeContext } from '../context/TrueImageSizeContext';
import {
  currentAnnotatedImageRemoveCrop,
  setCurrentAnnotatedImagePixels,
} from '../current-annotated-image';
import type { Crop, Pixel } from '../types/image-annotation-types';
import { getAllPointsInPath } from '../utils/pixels-utils';
import AnnotationContainer from './AnnotationContainer';
function AnnotationsContainer() {
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

  const { currentSelectedCrop, setCurrentSelectedCrop } =
    useCurrentSelectedCropContext();

  //===========================================================================
  // State
  // ===========================================================================

  //===========================================================================
  // Functions
  //===========================================================================

  /**
   * Changes the current selected crop index with the new index
   * @param index The index of the crop that is selected
   */
  const selectCrop = (index: number) => {
    setCurrentSelectedCrop(index);
    console.log('selectCrop', index);
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
  // Variables
  //===========================================================================

  // Varible that will contain all the paths of all the crops to display
  const paths = currentImage.imageCrops
    ? currentImage.imageCrops.map((crop: Crop) => crop.cropPath)
    : [];

  return (
    <Annotations type="image" onDeleteAnnotation={deleteCrop}>
      {paths.map((path, index) => (
        <AnnotationContainer
          key={index}
          path={path}
          index={index}
          selectCrop={() => selectCrop(index)}
        />
      ))}
    </Annotations>
  );
}

export default AnnotationsContainer;
