import { cloneDeep } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../../stores/hooks';
import Annotations from '../../components/Annotations';
import { useSelectedBox } from '../../context/SelectedBoxContext';
import {
  currentAnnotatedImageRemoveCrop,
  setCurrentAnnotatedImageCropAnnotationAtIndex,
} from '../current-annotated-image';
import type { Crop } from '../types/image-annotation-types';
import AnnotationCardContainer from './AnnotationCardContainer';

function AnnotationsContainer() {
  //===========================================================================
  // Redux
  //===========================================================================

  const currentImage = useAppSelector(state => state.currentAnnotatedImage);

  const dispatch = useAppDispatch();

  //===========================================================================
  // Contexts
  //===========================================================================

  const { selectedBox, setSelectedBox } = useSelectedBox();

  //===========================================================================
  // State
  // ===========================================================================

  const [noiseList, setNoiseList] = useState<number[]>([]);

  //===========================================================================
  // Variables
  //===========================================================================

  // Reference array to text inputs
  const inputRefs = useRef<TextInput[]>([]);

  //===========================================================================
  // Functions
  //===========================================================================

  const insertIntoInputRefs = (ref: TextInput, index: number) => {
    inputRefs.current[index] = ref;
  };

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
    if (selectedBox !== undefined) {
      inputRefs.current.splice(0, selectedBox);
      dispatch(currentAnnotatedImageRemoveCrop(selectedBox));
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

  //===========================================================================
  // Render
  //===========================================================================

  useEffect(() => {
    setNoiseList(
      cloneDeep(currentImage.imageCrops)
        .map((crop, index) => crop.cropAnnotation === 'noise' && index)
        .filter(e => e !== false) as number[],
    );
  }, [currentImage.imageCrops]);

  return (
    <Annotations onDeleteAnnotation={deleteCrop} onMarkAsNoise={markAsNoise}>
      {paths.map((path, index) => (
        <AnnotationCardContainer
          key={index}
          path={path}
          index={index}
          selectCrop={() => selectCrop(index)}
          isNoise={noiseList.includes(index)}
          inputRefs={inputRefs}
          insertIntoInputRefs={insertIntoInputRefs}
        />
      ))}
    </Annotations>
  );
}

export default AnnotationsContainer;
