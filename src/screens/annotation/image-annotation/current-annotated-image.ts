import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AnnotatedImage } from '../../../types/annotated-files-types';
import { Size } from '../../../types/coordinates-types';
import { Crop, Pixel } from './types/image-annotation-types';

export const initialState: AnnotatedImage = {
  id: '',
  imageSource: '',
  imagePixels: [],
  imageCrops: [],
};

const currentAnnotatedImageSlice = createSlice({
  name: 'currentAnnotatedImage',
  initialState,
  reducers: {
    setCurrentAnnotatedImage: (
      state,
      action: PayloadAction<AnnotatedImage>,
    ) => {
      state = action.payload;
      return state;
    },
    setCurrentAnnotatedImageSrc: (state, action: PayloadAction<string>) => {
      state.imageSource = action.payload;
    },
    setCurrentAnnotatedId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    setCurrentAnnotatedImagePixels: (state, action: PayloadAction<Pixel[]>) => {
      state.imagePixels = action.payload;
    },
    setCurrentAnnotatedImageCrops: (state, action: PayloadAction<Crop[]>) => {
      state.imageCrops = action.payload;
    },
    setCurrentAnnotatedImageSize: (state, action: PayloadAction<Size>) => {
      state.imageSize = action.payload;
    },
    currentAnnotatedImageAddCrop: (state, action: PayloadAction<Crop>) => {
      state.imageCrops.push(action.payload);
    },
    currentAnnotatedImageRemoveCrop: (state, action: PayloadAction<number>) => {
      state.imageCrops.splice(action.payload, 1);
    },
    setCurrentAnnotatedImageCropAtIndex: (
      state,
      action: PayloadAction<{
        index: number;
        crop: Crop;
      }>,
    ) => {
      if (state.imageCrops.length > action.payload.index) {
        state.imageCrops[action.payload.index] = action.payload.crop;
      }
      return state;
    },
    setCurrentAnnotatedImageCropAnnotationAtIndex: (
      state,
      action: PayloadAction<{
        index: number;
        annotation: string;
      }>,
    ) => {
      if (state.imageCrops.length > action.payload.index) {
        state.imageCrops[action.payload.index].cropAnnotation =
          action.payload.annotation;
      }
      return state;
    },
    resetCurrentAnnotatedImage: state => {
      state = initialState;
      return state;
    },
  },
});

export const {
  setCurrentAnnotatedImage,
  setCurrentAnnotatedImageSrc,
  setCurrentAnnotatedId,
  setCurrentAnnotatedImagePixels,
  setCurrentAnnotatedImageCrops,
  setCurrentAnnotatedImageSize,
  currentAnnotatedImageAddCrop,
  currentAnnotatedImageRemoveCrop,
  setCurrentAnnotatedImageCropAtIndex,
  setCurrentAnnotatedImageCropAnnotationAtIndex,
  resetCurrentAnnotatedImage,
} = currentAnnotatedImageSlice.actions;

export default currentAnnotatedImageSlice.reducer;
