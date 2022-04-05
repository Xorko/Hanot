import {configureStore} from '@reduxjs/toolkit';
import loadedFilesReducer from '../features/files/loaded-files-slice';

export const store = configureStore({
  reducer: {loadedFiles: loadedFilesReducer},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
