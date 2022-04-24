import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as InkML from '../core/inkml';

type AnnotatedInkml = {
  filePath: string;
  content: InkML.Type;
};

export interface AnnotatedInkmlState {
  annotatedInkml: AnnotatedInkml[];
}

const initialState: AnnotatedInkmlState = {
  annotatedInkml: [],
};

const annotatedInkmlSlice = createSlice({
  name: 'annotatedInkml',
  initialState,
  reducers: {
    setAnnotatedInkml: (state, action: PayloadAction<AnnotatedInkml[]>) => {
      state.annotatedInkml = action.payload;
    },
    addAnnotatedInkml: (state, action: PayloadAction<AnnotatedInkml>) => {
      const inkmlIndex = state.annotatedInkml.findIndex(
        e => e.filePath === action.payload.filePath,
      );
      if (inkmlIndex === -1) {
        state.annotatedInkml.push(action.payload);
      } else {
        state.annotatedInkml[inkmlIndex] = action.payload;
      }
    },
  },
});

export const { setAnnotatedInkml, addAnnotatedInkml } =
  annotatedInkmlSlice.actions;

export default annotatedInkmlSlice.reducer;
