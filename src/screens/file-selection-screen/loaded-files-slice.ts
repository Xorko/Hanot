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
    removeTextFiles: (state, action: PayloadAction<any[]>) => {
      action.payload.forEach(file => {
        const index = state.textFileInfo.findIndex(f => f.id === file.id);
        if (index !== -1) {
          state.textFileInfo.splice(index, 1);
        }
      });
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
    removeImageFiles: (state, action: PayloadAction<any[]>) => {
      action.payload.forEach(file => {
        const index = state.imageFileInfo.findIndex(f => f.id === file.id);
        if (index !== -1) {
          state.imageFileInfo.splice(index, 1);
        }
      });
    },
  },
});

export const {
  addTextFile,
  addImageFile,
  removeImageFile,
  removeImageFiles,
  removeTextFile,
  removeTextFiles,
} = loadedFilesSlice.actions;

export default loadedFilesSlice.reducer;
