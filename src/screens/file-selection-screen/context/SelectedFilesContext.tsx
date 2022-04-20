import { createContext, useContext, useState } from 'react';

type SelectedFilesContexValue = {
  selectedFiles: string[];
  setSelectedFiles: (newSelectedFile: string[]) => void;
};

type SelectedFilesProviderProps = {
  initialSelectedFiles?: string[];
  children: React.ReactNode;
};

const SelectedFilesContext = createContext<
  SelectedFilesContexValue | undefined
>(undefined);

export function SelectedFilesProvider({
  initialSelectedFiles: initialSelectedFile,
  children,
}: SelectedFilesProviderProps) {
  const [selectedFile, setSelectedFiles] = useState<string[]>(
    initialSelectedFile || [],
  );

  return (
    <SelectedFilesContext.Provider
      value={{ selectedFiles: selectedFile, setSelectedFiles }}>
      {children}
    </SelectedFilesContext.Provider>
  );
}

export function useSelectedFiles() {
  const context = useContext(SelectedFilesContext);

  if (context === undefined) {
    throw new Error(
      'useSelectedFiles must be used within a SelectedFilesProvider',
    );
  }

  return context;
}
