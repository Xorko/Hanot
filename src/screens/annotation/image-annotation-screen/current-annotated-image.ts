import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Crop, Pixel } from './types/image-annotation-types';
import type { annotatedImage } from './types/store-state-types';

export interface CurrentAnnotatedImageState {
  annotatedImage: annotatedImage;
}

const initialState: CurrentAnnotatedImageState = {
  annotatedImage: {
    filePath: '',
    imageSource: '',
    imagePixels: [],
    imageCrops: [],
    imageWidth: 0,
  },
};

const currentAnnotatedImageSlice = createSlice({
  name: 'currentAnnotatedImage',
  initialState,
  reducers: {
    setCurrentAnnotatedImage: (
      state,
      action: PayloadAction<annotatedImage>,
    ) => {
      state.annotatedImage = action.payload;
    },
    setCurrentAnnotatedImageSrc: (state, action: PayloadAction<string>) => {
      state.annotatedImage.imageSource = action.payload;
    },
    setCurrentAnnotatedImageFilePath: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.annotatedImage.filePath = action.payload;
    },
    setCurrentAnnotatedImagePixels: (state, action: PayloadAction<Pixel[]>) => {
      state.annotatedImage.imagePixels = action.payload;
    },
    setCurrentAnnotatedImageCrops: (state, action: PayloadAction<Crop[]>) => {
      state.annotatedImage.imageCrops = action.payload;
    },
    setCurrentAnnotatedImageWidth: (state, action: PayloadAction<number>) => {
      state.annotatedImage.imageWidth = action.payload;
    },
    currentAnnotatedImageAddCrop: (state, action: PayloadAction<Crop>) => {
      state.annotatedImage.imageCrops.push(action.payload);
    },
    currentAnnotatedImageRemoveCrop: (state, action: PayloadAction<number>) => {
      state.annotatedImage.imageCrops.splice(action.payload, 1);
    },
    setCurrentAnnotatedImageCropAtIndex: (
      state,
      action: PayloadAction<{
        index: number;
        crop: Crop;
      }>,
    ) => {
      state.annotatedImage.imageCrops[action.payload.index] =
        action.payload.crop;
    },
    setCurrentAnnotatedImageCropAnnotationAtIndex: (
      state,
      action: PayloadAction<{
        index: number;
        annotation: string;
      }>,
    ) => {
      state.annotatedImage.imageCrops[action.payload.index].cropAnnotation =
        action.payload.annotation;
    },
    resetCurrentAnnotatedImage: state => {
      state.annotatedImage = initialState.annotatedImage;
    },
    // TODO: Add reducers for modifying the pixels of the image ?
  },
});

export const {
  setCurrentAnnotatedImage,
  setCurrentAnnotatedImageSrc,
  setCurrentAnnotatedImageFilePath,
  setCurrentAnnotatedImagePixels,
  setCurrentAnnotatedImageCrops,
  setCurrentAnnotatedImageWidth,
  currentAnnotatedImageAddCrop,
  currentAnnotatedImageRemoveCrop,
  setCurrentAnnotatedImageCropAtIndex,
  setCurrentAnnotatedImageCropAnnotationAtIndex,
  resetCurrentAnnotatedImage,
} = currentAnnotatedImageSlice.actions;

export default currentAnnotatedImageSlice.reducer;
