import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Dot from '../../../core/dot';
import * as Trace from '../../../core/trace';
import * as TraceGroup from '../../../core/tracegroup';
import * as Word from '../../../core/word';

const initialState: Word.Type = {
  tracegroups: [],
  defaultTraceGroup: [],
  annotations: {},
  attributes: {},
  predicted: undefined,
};

export const currentWordSlice = createSlice({
  name: 'currentWord',
  initialState,
  reducers: {
    initWord: (state, action: PayloadAction<Word.Type>) => {
      console.log(
        'action.payload.tracegroups ' + action.payload.tracegroups.length,
      );
      state.tracegroups = action.payload.tracegroups;
      state.defaultTraceGroup = action.payload.defaultTraceGroup;
      state.attributes = action.payload.attributes;
      state.annotations = action.payload.annotations;
      return state;
    },
    setTraceGroups: (state, traceGroups: PayloadAction<TraceGroup.Type[]>) => {
      state.tracegroups = traceGroups.payload;
      return state;
    },
    setDefaultTraceGroup: (state, trace: PayloadAction<Trace.Type[]>) => {
      state.defaultTraceGroup = trace.payload;
      return state;
    },
    pushTraceToRight: (state, traces: PayloadAction<Trace.Type[]>) => {
      state.tracegroups[state.tracegroups.length - 1].traces.push(
        traces.payload[0],
      );
      return state;
    },
    pushDotsToRight: (state, dots: PayloadAction<Dot.Type[]>) => {
      state.tracegroups[state.tracegroups.length - 1].traces.push({
        dots: dots.payload,
      });
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  initWord,
  setTraceGroups,
  setDefaultTraceGroup,
  pushTraceToRight,
  pushDotsToRight,
} = currentWordSlice.actions;

export default currentWordSlice.reducer;
