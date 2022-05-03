import React, { createContext, useState } from 'react';
import * as Word from '../../../../core/word';

type CurrentWordContextValue = {
  currentWord?: Word.Type;
  changeCurrentWord: (newWord: Word.Type) => void;
};

type CurrentWordContextProviderProps = {
  initialCurrentTrace?: Word.Type;
  children: React.ReactNode;
};

const CurrentWordContext = createContext<CurrentWordContextValue | undefined>(
  undefined,
);

export const CurrentWordProvider = ({
  initialCurrentTrace,
  children,
}: CurrentWordContextProviderProps) => {
  const [currentWord, setCurrentWord] = useState<Word.Type | undefined>(
    initialCurrentTrace,
  );

  const changeCurrentWord = (newWord: Word.Type) => {
    setCurrentWord(newWord);
  };

  return (
    <CurrentWordContext.Provider value={{ currentWord, changeCurrentWord }}>
      {children}
    </CurrentWordContext.Provider>
  );
};

export const useCurrentWordContext = () => {
  const context = React.useContext(CurrentWordContext);
  if (context === undefined) {
    throw new Error(
      'useCurrentWordContext must be used within a CurrentWordProvider',
    );
  }
  return context;
};
