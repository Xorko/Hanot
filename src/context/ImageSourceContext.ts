import {createContext} from 'react';

type ImageSourceContextValue = {
  imageSource: string;
  changeSource: (newSource: string) => void;
};

export const ImageSourceContext = createContext<ImageSourceContextValue>({
  imageSource: '',
  changeSource: newSource => console.log(newSource), // TODO Find a cleaner way to do this
});
