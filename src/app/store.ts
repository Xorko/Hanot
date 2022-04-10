import {configureStore} from '@reduxjs/toolkit';
import loadedFilesReducer from '../screens/file-selection-screen/loaded-files-slice';
import currentAnnotatedImageReducer from '../screens/annotation/image-annotation-screen/current-annotated-image';

export const store = configureStore({
  reducer: {
    loadedFiles: loadedFilesReducer,
    currentAnnotatedImage: currentAnnotatedImageReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
