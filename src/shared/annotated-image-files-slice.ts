import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { annotatedImage } from '../screens/annotation/image-annotation-screen/types/store-state-types';

export interface AnnotatedImagesState {
  annotatedImages: annotatedImage[];
}

const initialState: AnnotatedImagesState = {
  annotatedImages: [],
};

const annotatedImagesSlice = createSlice({
  name: 'annotatedImages',
  initialState,
  reducers: {
    setAnnotatedImages: (state, action: PayloadAction<annotatedImage[]>) => {
      state.annotatedImages = action.payload;
    },
    addAnnotatedImage: (state, action: PayloadAction<annotatedImage>) => {
      const imageIndex = state.annotatedImages.findIndex(
        e => e.filePath === action.payload.filePath,
      );
      if (imageIndex === -1) {
        state.annotatedImages.push(action.payload);
      } else {
        state.annotatedImages[imageIndex] = action.payload;
      }
    },
  },
});

export const { setAnnotatedImages, addAnnotatedImage } =
  annotatedImagesSlice.actions;

export default annotatedImagesSlice.reducer;
