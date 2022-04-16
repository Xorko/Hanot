import React from 'react';
import {View} from 'react-native';
import {useAppDispatch} from '../../../../app/hooks';
import {useCurrentSelectedCropContext} from '../context/CurrentSelectedCropContext';
import {currentAnnotatedImageRemoveCrop} from '../current-annotated-image';
import DeleteButton from './DeleteButton';
import ValidateButton from './ValidateButton';

type CropContainerButtonsPropsType = {
  currentSelectedCrop?: number;
  annotate: () => void;
};

const CropContainerButtons = ({
  currentSelectedCrop,
  annotate,
}: CropContainerButtonsPropsType) => {
  //===========================================================================
  // Redux
  //===========================================================================

  const dispatch = useAppDispatch();

  //===========================================================================
  // Contexts
  //===========================================================================

  const {setCurrentSelectedCrop} = useCurrentSelectedCropContext();

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
    if (currentSelectedCrop !== undefined) {
      dispatch(currentAnnotatedImageRemoveCrop(currentSelectedCrop));
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
