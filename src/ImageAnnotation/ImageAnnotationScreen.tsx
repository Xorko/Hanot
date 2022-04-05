import React, {Fragment} from 'react';
import ImageAnnotationContainer from './ImageAnnotationContainer';
import ImageLettersMenu from './ImageLettersMenu';

const ImageAnnotationScreen = () => {
  return (
    <Fragment>
      <ImageLettersMenu />
      <ImageAnnotationContainer />
    </Fragment>
  );
};

export default ImageAnnotationScreen;
