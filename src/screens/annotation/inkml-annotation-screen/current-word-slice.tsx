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
    /**
     * @param word the word that will be initialized as a state
     * @returns the new state
     */
    initWord: (state, word: PayloadAction<Word.Type>) => {
      state.tracegroups = word.payload.tracegroups;
      state.defaultTraceGroup = word.payload.defaultTraceGroup;
      state.attributes = word.payload.attributes;
      state.annotations = word.payload.annotations;
      return state;
    },
    /**
     *
     * @param traces The traces to be added at the end of the current word tracegroups
     * @returns the modified word as a state
     */
    pushTraces: (state, traces: PayloadAction<Trace.Type[]>) => {
      state.tracegroups[state.tracegroups.length - 1].traces.push(
        traces.payload[0],
      );
      return state;
    },

    setDefaultTraceGroup: (state, traces: PayloadAction<Trace.Type[]>) => {
      state.defaultTraceGroup = traces.payload;
      return state;
    },

    setFinalTraceGroups: (
      state,
      traceGroups: PayloadAction<TraceGroup.Type[]>,
    ) => {
      state.tracegroups = traceGroups.payload;
      return state;
    },

    deleteTraceGroup: (state, traceGroup: PayloadAction<TraceGroup.Type>) => {
      traceGroup.payload.traces.reverse().map(trace => {
        state.defaultTraceGroup[trace.oldTrace].dots = [
          ...trace.dots,
          ...state.defaultTraceGroup[trace.oldTrace].dots,
        ];
      });
    },

    /**
     *
     * @param dots The dots to be added at the end of the current word tracegroups
     * @returns the modified word as a state
     */
    pushDots: (
      state,
      action: PayloadAction<{ leftTrace: Dot.Type[]; idxTrace: number }>,
    ) => {
      state.tracegroups[state.tracegroups.length - 1].traces.push({
        dots: action.payload.leftTrace,
        oldTrace: action.payload.idxTrace,
      });
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  initWord,
  pushTraces,
  pushDots,
  setDefaultTraceGroup,
  deleteTraceGroup,
  setFinalTraceGroups,
} = currentWordSlice.actions;

export default currentWordSlice.reducer;
