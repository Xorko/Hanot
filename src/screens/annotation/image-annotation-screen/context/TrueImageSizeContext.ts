import {createContext} from 'react';
import {Size} from '../types/image-annotation-types';

type TrueImageSizeContextValue = {
  trueImageSize?: Size;
};

export const TrueImageSizeContext = createContext<TrueImageSizeContextValue>({
  trueImageSize: {} as Size,
});
