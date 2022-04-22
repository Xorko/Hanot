import { createContext, useContext, useState } from 'react';

type FileSelectionMode = 'single' | 'multiple';

type FileSelectionModeContextValue = {
  fileSelectionMode: FileSelectionMode;
  setFileSelectionMode: (newFileSelectionMode: FileSelectionMode) => void;
};

type FileSelectionModeContextProviderProps = {
  initialType?: FileSelectionMode;
  children: React.ReactNode;
};

const FileSelectionModeContext = createContext<
  FileSelectionModeContextValue | undefined
>(undefined);

export function FileSelectionModeProvider({
  initialType,
  children,
}: FileSelectionModeContextProviderProps) {
  const [fileSelectionMode, setFileSelectionMode] = useState<FileSelectionMode>(
    initialType || 'single',
  );

  return (
    <FileSelectionModeContext.Provider
      value={{ fileSelectionMode, setFileSelectionMode }}>
      {children}
    </FileSelectionModeContext.Provider>
  );
}

export function useFileSelectionMode() {
  const context = useContext(FileSelectionModeContext);

  if (context === undefined) {
    throw new Error(
      'useFileSelectionMode must be used within a FileSelectionModeProvider',
    );
  }

  return context;
}
