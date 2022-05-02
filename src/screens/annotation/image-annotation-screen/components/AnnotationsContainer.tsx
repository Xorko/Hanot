import { cloneDeep } from 'lodash';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../stores/hooks';
import Annotations from '../../components/Annotations';
import { useSelectedBox } from '../../context/SelectedBoxContext';
import { useTrueImageSizeContext } from '../context/TrueImageSizeContext';
import {
  currentAnnotatedImageRemoveCrop,
  setCurrentAnnotatedImageCropAnnotationAtIndex,
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

  const { selectedBox, setSelectedBox } = useSelectedBox();

  //===========================================================================
  // State
  // ===========================================================================

  const [noiseList, setNoiseList] = useState<number[]>([]);

  //===========================================================================
  // Functions
  //===========================================================================

  /**
   * Changes the current selected crop index with the new index
   * @param index The index of the crop that is selected
   */
  const selectCrop = (index: number) => {
    if (selectedBox === index) {
      setSelectedBox(undefined);
    } else {
      setSelectedBox(index);
    }
  };

  const markAsNoise = () => {
    if (selectedBox !== undefined) {
      dispatch(
        setCurrentAnnotatedImageCropAnnotationAtIndex({
          index: selectedBox,
          annotation: 'noise',
        }),
      );
      setNoiseList(prev => [...prev, selectedBox]);
      setSelectedBox(undefined);
    }
  };

  /**
   * Removes the crop from the redux store
   */
  const deleteCrop = () => {
    if (selectedBox !== undefined && trueImageSize) {
      const pixelsCopy: Pixel[] = cloneDeep(currentImage.imagePixels);

      getAllPointsInPath(
        currentImage.imageCrops[selectedBox].cropPath,
        trueImageSize.width,
      ).forEach((index: number) => {
        // For every point, sets the annotation of the corresponding pixel to the one of the crop, if the pixel is not white (background)
        const pixel: Pixel = pixelsCopy[index];
        pixel.annotation = undefined;
      });

      dispatch(currentAnnotatedImageRemoveCrop(selectedBox));
      dispatch(setCurrentAnnotatedImagePixels(pixelsCopy));
      setSelectedBox(undefined);
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
    <Annotations onDeleteAnnotation={deleteCrop} onMarkAsNoise={markAsNoise}>
      {paths.map((path, index) => (
        <AnnotationContainer
          key={index}
          path={path}
          index={index}
          selectCrop={() => selectCrop(index)}
          isNoise={noiseList.includes(index)}
        />
      ))}
    </Annotations>
  );
}

export default AnnotationsContainer;
