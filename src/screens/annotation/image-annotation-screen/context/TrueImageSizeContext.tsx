import React, { createContext } from 'react';
import { Size } from '../types/image-annotation-types';

type TrueImageSizeContextValue = {
  trueImageSize?: Size;
  setTrueImageSize: (size: Size) => void;
};

type TrueImageSizeContextProviderProps = {
  initialTrueImageSize?: Size;
  children: React.ReactNode;
};

const TrueImageSizeContext = createContext<
  TrueImageSizeContextValue | undefined
>(undefined);

export const TrueImageSizeContextProvider = ({
  initialTrueImageSize,
  children,
}: TrueImageSizeContextProviderProps) => {
  const [trueImageSize, setTrueImageSize] = React.useState<Size | undefined>(
    initialTrueImageSize,
  );

  return (
    <TrueImageSizeContext.Provider value={{ trueImageSize, setTrueImageSize }}>
      {children}
    </TrueImageSizeContext.Provider>
  );
};

export const useTrueImageSizeContext = () => {
  const context = React.useContext(TrueImageSizeContext);
  if (context === undefined) {
    throw new Error(
      'useTrueImageSizeContext must be used within a TrueImageSizeContextProvider',
    );
  }
  return context;
};
