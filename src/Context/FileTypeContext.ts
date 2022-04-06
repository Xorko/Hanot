import {createContext} from 'react';

export type FileType = 'image' | 'inkml';

type FileTypeContextValue = {
  type: FileType;
  changeType: () => void;
};

export const FileTypeContext = createContext<FileTypeContextValue>({
  type: 'inkml',
  changeType: () => {}, // TODO Find a cleaner way to do this
});
