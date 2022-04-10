import {createContext} from 'react';
import {Size} from '../types/image-annotation-types';

type DisplayedImageSizeContextValue = {
  displayedImageSize: Size;
  changeDisplayedImageSize: (size: Size) => void;
};

export const DisplayedImageSizeContext =
  createContext<DisplayedImageSizeContextValue>({
    displayedImageSize: {} as Size,
    changeDisplayedImageSize: () => {},
  });
