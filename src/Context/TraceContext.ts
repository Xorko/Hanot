import {createContext} from 'react';
import * as Word from '../core/word';

type TraceContextValue = {
  currentWord?: Word.Type;
  changeCurrentWord: (newWord: Word.Type) => void;
};

export const TraceContext = createContext<TraceContextValue>({
  currentWord: undefined,
  changeCurrentWord: newWord => console.log(newWord), // TODO Find a cleaner way to do this
});
