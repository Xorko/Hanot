import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Char from '../../../core/char';
import * as Dot from '../../../core/dot';
import * as Trace from '../../../core/trace';
import * as TraceGroup from '../../../core/tracegroup';
import { createEmptyTraceGroup } from '../../../core/tracegroup';
import * as Word from '../../../core/word';

export const initialState: Word.Type = {
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
     * @param word the word that will be initialized as state
     * @returns the new state
     */
    initWord: (state, word: PayloadAction<Word.Type>) => {
      state.tracegroups = word.payload.tracegroups;
      state.defaultTraceGroup = word.payload.defaultTraceGroup;
      state.attributes = word.payload.attributes;
      state.annotations = word.payload.annotations;
      state.predicted = word.payload.predicted;
      return state;
    },

    /**
     * Adds the first element of traces to the last tracegroup of the currentWord
     * @param state the currentWord
     * @param traces an array of Trace
     * @returns the new state
     */
    pushTraces: (state, traces: PayloadAction<Trace.Type[]>) => {
      if (state.tracegroups[state.tracegroups.length - 1]) {
        state.tracegroups[state.tracegroups.length - 1].traces.push(
          traces.payload[0],
        );
      } else {
        throw new Error('Index out of range (state.tracegroups.length - 1]');
      }
      return state;
    },

    /**
     * @param state the currentWord
     * @param traces an array of traces wich will be set in the defaultTraceGroup field of the currentWord
     * @returns the new state
     */
    setDefaultTraceGroup: (state, traces: PayloadAction<Trace.Type[]>) => {
      state.defaultTraceGroup = traces.payload;
      return state;
    },

    /**
     *
     * @param state the currentWord
     * @param traceGroups a TraceGroup array which will be set in the field tracegroups of the currentWord
     * @returns the new state
     */
    setFinalTraceGroups: (
      state,
      traceGroups: PayloadAction<TraceGroup.Type[]>,
    ) => {
      state.tracegroups = traceGroups.payload;
      return state;
    },

    /**
     * Put back in defaultTraceGroup, every dots which have been removed from the different traces
     * @param state
     * @param traceGroups traceGroups containing points which will be put in defaultTraceGroup
     */
    deleteTraceGroups: (
      state,
      traceGroups: PayloadAction<TraceGroup.Type[]>,
    ) => {
      traceGroups.payload.map(traceGroup => {
        traceGroup.traces.reverse().map(trace => {
          if (state.defaultTraceGroup[trace.oldTrace]) {
            state.defaultTraceGroup[trace.oldTrace].dots = [
              ...trace.dots,
              ...state.defaultTraceGroup[trace.oldTrace].dots,
            ];
          } else {
            state.defaultTraceGroup[trace.oldTrace] = {
              dots: trace.dots,
              oldTrace: -1,
            };
          }
        });
      });
    },

    /**
     * Pushes an empty traceGroup on the tracegroups field of the currentWord
     * @param state
     */
    pushTraceGroup: state => {
      state.tracegroups.push(createEmptyTraceGroup());
    },

    /**
     * Pushes a new trace built by parameters leftTrace and idxOldTrace
     * at the end of the traceGroup indicated by idxTraceGroup
     * @param action The dots to be added at the end of the current word tracegroups
     * @returns the modified word as a state
     */
    pushDots: (
      state,
      action: PayloadAction<{
        leftTrace: Dot.Type[];
        idxOldTrace: number;
        idxTraceGroup: number;
      }>,
    ) => {
      if (state.tracegroups[action.payload.idxTraceGroup]) {
        state.tracegroups[action.payload.idxTraceGroup].traces.push({
          dots: action.payload.leftTrace,
          oldTrace: action.payload.idxOldTrace,
        });
      } else {
        throw new Error('Index out of range (idxTraceGroup)');
      }
      return state;
    },

    /**
     * Annotates the traceGroup indicated by index with annotation.
     * @param state
     * @param action
     * @returns
     */
    annotateTraceGroup: (
      state,
      action: PayloadAction<{
        index: number;
        annotation: string;
      }>,
    ) => {
      if (state.tracegroups[action.payload.index]) {
        state.tracegroups[action.payload.index].label = Char.constructLetter(
          action.payload.annotation,
        );
      } else {
        throw new Error('Index out of range');
      }
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  initWord,
  pushTraces,
  pushDots,
  pushTraceGroup,
  annotateTraceGroup,
  setDefaultTraceGroup,
  deleteTraceGroups,
  setFinalTraceGroups,
} = currentWordSlice.actions;

export default currentWordSlice.reducer;
