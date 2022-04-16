import React, {createContext, useState} from 'react';

type CurrentSelectedCropContextValue = {
  currentSelectedCrop?: number;
  setCurrentSelectedCrop: (index?: number) => void;
};

type CurrentSelectedCropContextProviderProps = {
  initialCurrentSelectedCrop?: number;
  children: React.ReactNode;
};

const CurrentSelectedCropContext = createContext<
  CurrentSelectedCropContextValue | undefined
>(undefined);

export const CurrentSelectedCropProvider = ({
  initialCurrentSelectedCrop,
  children,
}: CurrentSelectedCropContextProviderProps) => {
  const [currentSelectedCrop, setCurrentSelectedCrop] = useState<
    number | undefined
  >(initialCurrentSelectedCrop);

  return (
    <CurrentSelectedCropContext.Provider
      value={{currentSelectedCrop, setCurrentSelectedCrop}}>
      {children}
    </CurrentSelectedCropContext.Provider>
  );
};

export const useCurrentSelectedCropContext = () => {
  const context = React.useContext(CurrentSelectedCropContext);
  if (context === undefined) {
    throw new Error(
      'useCurrentSelectedCropContext must be used within a CurrentSelectedCropProvider',
    );
  }
  return context;
};
