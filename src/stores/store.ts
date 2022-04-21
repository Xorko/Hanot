import { configureStore } from '@reduxjs/toolkit';
import currentAnnotatedImageReducer from '../screens/annotation/image-annotation-screen/current-annotated-image';
import currentWordReducer from '../screens/annotation/inkml-annotation-screen/current-word-slice';
import loadedFilesReducer from '../screens/file-selection-screen/loaded-files-slice';
import annotatedImagesReducer from '../shared/annotated-image-files-slice';

export const store = configureStore({
  reducer: {
    loadedFiles: loadedFilesReducer,
    currentAnnotatedImage: currentAnnotatedImageReducer,
    currentWord: currentWordReducer,
    annotatedImages: annotatedImagesReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
