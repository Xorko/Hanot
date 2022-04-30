import React, { createContext, useState } from 'react';

type DrawerStateContextValue = {
  isOpen?: boolean;
  setIsOpen: (open: boolean) => void;
};

type DrawerStateContextProviderProps = {
  initialState?: boolean;
  children: React.ReactNode;
};

const CurrentStatePanelContext = createContext<
  DrawerStateContextValue | undefined
>(undefined);

export const DrawerStateProvider = ({
  initialState,
  children,
}: DrawerStateContextProviderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(initialState || false);

  return (
    <CurrentStatePanelContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </CurrentStatePanelContext.Provider>
  );
};

export const useDrawerStateContext = () => {
  const context = React.useContext(CurrentStatePanelContext);
  if (context === undefined) {
    throw new Error(
      'useDrawerStateContext must be used within a DrawerStateContextProvider',
    );
  }
  return context;
};
