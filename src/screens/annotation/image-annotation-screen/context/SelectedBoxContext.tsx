import React, { createContext, useState } from 'react';

type SelectedBoxContextValue = {
  selectedBox?: number;
  setSelectedBox: (index?: number) => void;
};

type SelectedBoxContextProviderProps = {
  initialSelectedBox?: number;
  children: React.ReactNode;
};

const SelectedBoxContext = createContext<SelectedBoxContextValue | undefined>(
  undefined,
);

export const SelectedBoxProvider = ({
  initialSelectedBox,
  children,
}: SelectedBoxContextProviderProps) => {
  const [selectedBox, setSelectedBox] = useState<number | undefined>(
    initialSelectedBox,
  );

  return (
    <SelectedBoxContext.Provider value={{ selectedBox, setSelectedBox }}>
      {children}
    </SelectedBoxContext.Provider>
  );
};

export const useSelectedBox = () => {
  const context = React.useContext(SelectedBoxContext);
  if (context === undefined) {
    throw new Error('useSelectedBox must be used within a SelectedBoxProvider');
  }
  return context;
};
