import {createContext} from 'react';
import {Size} from '../types/image-annotation-types';

type TrueImageSizeContextValue = {
  trueImageSize?: Size;
  changeTrueImageSize: (size: Size) => void;
};

export const TrueImageSizeContext = createContext<TrueImageSizeContextValue>({
  trueImageSize: {} as Size,
  changeTrueImageSize: () => {},
});
