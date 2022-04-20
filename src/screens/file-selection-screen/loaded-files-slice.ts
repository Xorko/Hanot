import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ImageFile, InkMLFile } from './types/file-import-types';

export interface LoadedFilesState {
  textFileInfo: InkMLFile[];
  imageFileInfo: ImageFile[];
}

const initialState: LoadedFilesState = {
  textFileInfo: [],
  imageFileInfo: [],
};

const loadedFilesSlice = createSlice({
  name: 'loadedFiles',
  initialState,
  reducers: {
    addTextFile: (state, action: PayloadAction<any[]>) => {
      action.payload.forEach(file => {
        if (state.textFileInfo.find(f => f.fileName === file.fileName)) {
          return;
        } else {
          state.textFileInfo.push(file);
        }
      });
    },
    removeTextFile: (state, action: PayloadAction<any>) => {
      state.textFileInfo.splice(action.payload, 1);
    },
    addImageFile: (state, action: PayloadAction<any[]>) => {
      action.payload.forEach(file => {
        if (state.imageFileInfo.find(f => f.fileName === file.fileName)) {
          return;
        } else {
          state.imageFileInfo.push(file);
        }
      });
    },
    removeImageFile: (state, action: PayloadAction<any>) => {
      state.imageFileInfo.splice(action.payload, 1);
    },
  },
});

export const { addTextFile, addImageFile, removeImageFile, removeTextFile } =
  loadedFilesSlice.actions;

export default loadedFilesSlice.reducer;
