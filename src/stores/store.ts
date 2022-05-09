import { configureStore } from '@reduxjs/toolkit';
import currentAnnotatedImageReducer from '../screens/annotation/image-annotation/current-annotated-image';
import currentWordReducer from '../screens/annotation/inkml-annotation/current-word-slice';
import loadedFilesReducer from '../screens/file-selection-screen/loaded-files-slice';
import annotatedFilesReducer from '../shared/annotated-files-slice';

export const store = configureStore({
  reducer: {
    loadedFiles: loadedFilesReducer,
    currentAnnotatedImage: currentAnnotatedImageReducer,
    currentWord: currentWordReducer,
    annotatedFiles: annotatedFilesReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: { warnAfter: 128 },
      immutableCheck: { warnAfter: 128 },
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
