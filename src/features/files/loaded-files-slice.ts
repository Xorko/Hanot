import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface LoadedFilesState {
  textFileInfo: any[];
  imageFileInfo: any[];
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
      if (
        !state.textFileInfo.some(
          file => file.filePath === action.payload[0].filePath,
        )
      ) {
        action.payload.forEach(file => {
          state.textFileInfo.push(file);
        });
      }
    },
    removeTextFile: (state, action: PayloadAction<any>) => {
      state.textFileInfo.splice(action.payload, 1);
    },
    addImageFile: (state, action: PayloadAction<any[]>) => {
      action.payload.forEach(file => {
        state.imageFileInfo.push(file);
      });
    },
    removeImageFile: (state, action: PayloadAction<any>) => {
      state.imageFileInfo.splice(action.payload, 1);
    },
  },
});

export const {addTextFile, addImageFile, removeImageFile, removeTextFile} =
  loadedFilesSlice.actions;

export default loadedFilesSlice.reducer;