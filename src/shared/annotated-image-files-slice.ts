import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AnnotatedImage } from '../types/annotated-files-types';

type AnnotatedImagesState = {
  annotatedImages: AnnotatedImage[];
};

const initialState: AnnotatedImagesState = {
  annotatedImages: [],
};

const annotatedImagesSlice = createSlice({
  name: 'annotatedImages',
  initialState,
  reducers: {
    setAnnotatedImages: (state, action: PayloadAction<AnnotatedImage[]>) => {
      state.annotatedImages = action.payload;
    },
    addAnnotatedImage: (state, action: PayloadAction<AnnotatedImage>) => {
      const imageIndex = state.annotatedImages.findIndex(
        e => e.id === action.payload.id,
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
