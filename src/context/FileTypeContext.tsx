import { createContext, useContext, useState } from 'react';
import { FileType } from '../types/file-types';

type FileTypeContextValue = {
  fileType: FileType;
  setFileType: (newFileType: FileType) => void;
};

type FileTypeProviderProps = {
  initialType?: FileType;
  children: React.ReactNode;
};

const FileTypeContext = createContext<FileTypeContextValue | undefined>(
  undefined,
);

export function FileTypeProvider({
  initialType,
  children,
}: FileTypeProviderProps) {
  const [fileType, setFileType] = useState<FileType>(initialType || 'inkml');

  return (
    <FileTypeContext.Provider value={{ fileType, setFileType }}>
      {children}
    </FileTypeContext.Provider>
  );
}

export function useFileType() {
  const context = useContext(FileTypeContext);

  if (context === undefined) {
    throw new Error('useFileType must be used within a FileTypeProvider');
  }

  return context;
}
