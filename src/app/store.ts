import {configureStore} from '@reduxjs/toolkit';
import loadedFilesReducer from '../screens/file-selection-screen/loaded-files-slice';

export const store = configureStore({
  reducer: {loadedFiles: loadedFilesReducer},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
