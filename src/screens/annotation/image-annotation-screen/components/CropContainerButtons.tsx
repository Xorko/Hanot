import React, {useContext} from 'react';
import {View} from 'react-native';
import {useAppDispatch} from '../../../../app/hooks';
import {CurrentSelectedIndexCropContext} from '../context/CurrentSelectedCropContext';
import {currentAnnotatedImageRemoveCrop} from '../current-annotated-image';
import DeleteButton from './DeleteButton';
import ValidateButton from './ValidateButton';

interface CropContainerButtonsPropsType {
  currentSelectedCrop?: number;
  annotate: () => void;
}

const CropContainerButtons = ({
  currentSelectedCrop,
  annotate,
}: CropContainerButtonsPropsType) => {
  const dispatch = useAppDispatch();

  const {changeCurrentSelectedCropIndex} = useContext(
    CurrentSelectedIndexCropContext,
  );

  const validateCrop = () => {
    annotate();
  };

  const deleteCrop = () => {
    if (currentSelectedCrop !== undefined) {
      dispatch(currentAnnotatedImageRemoveCrop(currentSelectedCrop));
      changeCurrentSelectedCropIndex(undefined);
    }
  };

  return (
    <View>
      <ValidateButton validateCrop={validateCrop} />
      <DeleteButton deleteCrop={deleteCrop} />
    </View>
  );
};

export default CropContainerButtons;
