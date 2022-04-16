import React, {createContext} from 'react';
import {Size} from '../types/image-annotation-types';

type DisplayedImageSizeContextValue = {
  displayedImageSize?: Size;
  setDisplayedImageSize: (size: Size) => void;
};

type DisplayedImageSizeContextProviderProps = {
  initialDisplayedImageSize?: Size;
  children: React.ReactNode;
};

const DisplayedImageSizeContext = createContext<
  DisplayedImageSizeContextValue | undefined
>(undefined);

export const DisplayedImageSizeContextProvider = ({
  initialDisplayedImageSize,
  children,
}: DisplayedImageSizeContextProviderProps) => {
  const [displayedImageSize, setDisplayedImageSize] = React.useState<
    Size | undefined
  >(initialDisplayedImageSize);

  return (
    <DisplayedImageSizeContext.Provider
      value={{displayedImageSize, setDisplayedImageSize}}>
      {children}
    </DisplayedImageSizeContext.Provider>
  );
};

export const useDisplayedImageSizeContext = () => {
  const context = React.useContext(DisplayedImageSizeContext);
  if (context === undefined) {
    throw new Error(
      'useDisplayedImageSizeContext must be used within a DisplayedImageSizeContextProvider',
    );
  }
  return context;
};
