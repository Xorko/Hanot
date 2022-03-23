import {createContext} from 'react';

export type DisplayMode = 'block' | 'list';

type ModeContextValue = {
  mode: DisplayMode;
  changeMode: (newMode: DisplayMode) => void;
};

export const ModeContext = createContext<ModeContextValue>({
  mode: 'block',
  changeMode: newMode => console.log(newMode), // TODO Find a cleaner way to do this
});
