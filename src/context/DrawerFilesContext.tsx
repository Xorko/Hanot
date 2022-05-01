import React, { createContext, useState } from 'react';

type DrawerFilesContextValue = {
  openedFiles?: string[];
  setOpenedFiles: (openedFiles: string[]) => void;
};

type DrawerFilesContextProviderProps = {
  initialState?: string[];
  children: React.ReactNode;
};

const DrawerFilesContext = createContext<DrawerFilesContextValue | undefined>(
  undefined,
);

export const DrawerFilesContextProvider = ({
  initialState,
  children,
}: DrawerFilesContextProviderProps) => {
  const [openedFiles, setOpenedFiles] = useState<string[]>(initialState || []);

  return (
    <DrawerFilesContext.Provider value={{ openedFiles, setOpenedFiles }}>
      {children}
    </DrawerFilesContext.Provider>
  );
};

export const useDrawerFilesContext = () => {
  const context = React.useContext(DrawerFilesContext);
  if (context === undefined) {
    throw new Error(
      'useDrawerFilesContext must be used within a DrawerFilesContextProvider',
    );
  }
  return context;
};
