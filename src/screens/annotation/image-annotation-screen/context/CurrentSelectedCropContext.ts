import {createContext} from 'react';

type CurrentSelectedCropIndexContextValue = {
  currentSelectedCropIndex?: number;
  changeCurrentSelectedCropIndex: (index?: number) => void;
};

export const CurrentSelectedIndexCropContext =
  createContext<CurrentSelectedCropIndexContextValue>({
    currentSelectedCropIndex: undefined,
    changeCurrentSelectedCropIndex: () => {},
  });
