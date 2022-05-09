import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  AnnotatedImage,
  AnnotatedInkml,
} from '../types/annotated-files-types';

type AnnotatedFilesState = {
  annotatedImages: AnnotatedImage[];
  annotatedInkml: AnnotatedInkml[];
};

export const initialState: AnnotatedFilesState = {
  annotatedImages: [],
  annotatedInkml: [],
};

const annotatedFilesSlice = createSlice({
  name: 'annotatedFiles',
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
    setAnnotatedInkml: (state, action: PayloadAction<AnnotatedInkml[]>) => {
      state.annotatedInkml = action.payload;
    },
    addAnnotatedInkml: (state, action: PayloadAction<AnnotatedInkml>) => {
      const inkmlIndex = state.annotatedInkml.findIndex(
        e => e.id === action.payload.id,
      );
      if (inkmlIndex === -1) {
        state.annotatedInkml.push(action.payload);
      } else {
        state.annotatedInkml[inkmlIndex] = action.payload;
      }
    },
  },
});

export const {
  setAnnotatedImages,
  addAnnotatedImage,
  setAnnotatedInkml,
  addAnnotatedInkml,
} = annotatedFilesSlice.actions;

export default annotatedFilesSlice.reducer;
