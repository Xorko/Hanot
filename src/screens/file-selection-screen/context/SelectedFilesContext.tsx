import { createContext, useContext, useState } from 'react';
import { FileType } from '../../../types/file-types';

type SelectedFileType = {
  id: string;
  fileName: string;
  type: FileType;
};

type SelectedFilesContexValue = {
  selectedFiles: SelectedFileType[];
  setSelectedFiles: (newSelectedFile: SelectedFileType[]) => void;
};

type SelectedFilesProviderProps = {
  initialSelectedFiles?: SelectedFileType[];
  children: React.ReactNode;
};

const SelectedFilesContext = createContext<
  SelectedFilesContexValue | undefined
>(undefined);

export function SelectedFilesProvider({
  initialSelectedFiles: initialSelectedFile,
  children,
}: SelectedFilesProviderProps) {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFileType[]>(
    initialSelectedFile || [],
  );

  return (
    <SelectedFilesContext.Provider value={{ selectedFiles, setSelectedFiles }}>
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
