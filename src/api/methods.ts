import * as Trace from '../core/trace';
import * as TraceGroup from '../core/tracegroup';
import * as Word from '../core/word';
import {
  constructLetter,
  getChar,
  isLetter,
  isPending,
  noise,
  pendingChar,
} from '../core/char';
import { createEmptyTraceGroup } from './in';

/**
 * Get all annotations for rendering.
 * @param word the word to extract annotations.
 */
export const annotas = (word: Word.Type): string[] => {
  return getAnnotated(word).map(e => getChar(e.label)) as string[];
};

/**
 * Get largest index in a word, if it's -1 then the word has no trace group (except default one).
 * @param word the word to inspect.
 */
export const rightmost = (word: Word.Type): number => {
  return word.tracegroups.length - 1;
};

/**
 * Get a joined view of the word's annotation.
 * @param word the word to inspect.
 */
export const getWord = (word: Word.Type): string => {
  return annotas(word).join();
};

/**
 * Get annotated trace groups of a word.
 * @param word the word to inspect.
 */
export const getAnnotated = (word: Word.Type): TraceGroup.Type[] => {
  return word.tracegroups.filter(e => isLetter(e.label));
};

/**
 * Get un-annotated trace groups of a word, notice that this does not include default trace group.
 * @param word the word to inspect.
 */
export const getPending = (word: Word.Type): TraceGroup.Type[] => {
  return word.tracegroups.filter(e => isPending(e.label));
};

/**
 * Get un annotated and un-grouped traces of a word.
 * @param word the word to inspect.
 */
export const getDefault = (word: Word.Type): Trace.Type[] => {
  return word.defaultTraceGroup;
};

/**
 * Split a trace group, with some of its traces remain while others move to the next trace group.
 * @param at the position of break in the target trace group, all traces before this (exclusive) keep intact in the target,
 * and all traces after this (inclusive) will be moved to next trace group.
 * @param of the position of the target trace group to operate on.
 * @param word the word to operate on.
 */
export const splitGroup = (at: number, of: number, word: Word.Type): void => {
  if (!Number.isInteger(at) || !Number.isInteger(of)) {
    throw new Error();
  } else if (of < 0 || of >= word.tracegroups.length) {
    throw new Error();
  } else {
    const len = word.tracegroups[of].traces.length;
    if (at < 0 || at >= len) {
      throw new Error();
    } else {
      word.tracegroups.splice(
        of + 1,
        0,
        createEmptyTraceGroup(word.tracegroups[of].traces.slice(at)),
      );
      word.tracegroups[of].traces.splice(0, at);
    }
  }
};

/**
 * Concat two trace groups in a word.
 * @param head the index of first trace group in this word to be concatenated.
 * @param end the index of second trace group in this word to be concatenated.
 * @param word the word to operate.
 * @param leftToRight if this is true, then the concatenated trace group will replace the first group and the second group
 * will be removed. Otherwise acts in reverse order.
 */
export const concatGroup = (
  head: number,
  end: number,
  word: Word.Type,
  leftToRight = true,
): void => {
  if (!Number.isInteger(head) || !Number.isInteger(end)) {
    throw new Error();
  } else if (head < 0 || end >= word.tracegroups.length || head > end) {
    throw new Error();
  } else {
    if (leftToRight) {
      word.tracegroups[head].traces.push(...word.tracegroups[end].traces);
      word.tracegroups.splice(end, 1);
    } else {
      word.tracegroups[end].traces.push(...word.tracegroups[head].traces);
      word.tracegroups.splice(head, 1);
    }
  }
};

/**
 * Concat a trace group in a word with another given trace group.
 * [Warning]: This operation does not change the given trace group, you may have to remove it from its own word to maintain
 * consistency. To do operation on trace groups in same word, prefer to use `concatGroup(...)`
 * @param base the index of the base trace group in this word.
 * @param word the word to operate.
 * @param tr another trace group, could be outside the word or not.
 * @param leftToRight if this is true, then the traces in base come first before traces in other group, otherwise in the
 * reversed order.
 */
export const crossConcatGroup = (
  base: number,
  word: Word.Type,
  tr: TraceGroup.Type,
  leftToRight = true,
): void => {
  if (!Number.isInteger(base) || !Number.isInteger(base)) {
    throw new Error();
  } else if (base < 0 || base >= word.tracegroups.length) {
    throw new Error();
  } else {
    if (leftToRight) {
      word.tracegroups[base].traces = [
        ...word.tracegroups[base].traces,
        ...tr.traces,
      ];
    } else {
      word.tracegroups[base].traces = [
        ...tr.traces,
        ...word.tracegroups[base].traces,
      ];
    }
  }
};

/**
 * Split a trace into two separated traces, in a given trace group.
 * @param base the index of trace in the trace group to split.
 * @param from the index of split, dots from 0 to this index (exclusive) will be retained in the old trace, while new trace
 * contains dots from this index (inclusive) to the end of old trace.
 * @param trg the trace group to operate.
 */
export const split = (
  base: number,
  from: number,
  trg: TraceGroup.Type,
): void => {
  if (!Number.isInteger(base) || !Number.isInteger(from)) {
    throw new Error();
  } else if (base < 0 || base >= trg.traces.length) {
    throw new Error();
  } else if (from < 0 || from >= trg.traces[base].dots.length) {
    throw new Error();
  } else {
    const newTrace = trg.traces[base].dots.slice(from);
    trg.traces.splice(base + 1, 0, { dots: newTrace });
    trg.traces[base].dots.splice(0, from);
  }
};

/**
 * Concat two traces in a trace group.
 * @param head the index of first trace in this trace group to be concatenated.
 * @param end the index of second trace in this trace group to be concatenated.
 * @param trg the trace group to operate.
 * @param leftToRight if this is true, then the concatenated trace will replace the first trace and the second trace
 * will be removed. Otherwise acts in reverse order.
 */
export const concat = (
  head: number,
  end: number,
  trg: TraceGroup.Type,
  leftToRight = true,
): void => {
  if (!Number.isInteger(head) || !Number.isInteger(end)) {
    throw new Error();
  } else if (head < 0 || end >= trg.traces.length || head > end) {
    throw new Error();
  } else {
    if (leftToRight) {
      trg.traces[head].dots.push(...trg.traces[end].dots);
      trg.traces.splice(end, 1);
    } else {
      trg.traces[end].dots.push(...trg.traces[head].dots);
      trg.traces.splice(head, 1);
    }
  }
};

/**
 * Concat a trace to a trace group in a given position.
 * [Warning]: This operation does not change the given trace, you may have to remove it from its own trace group to maintain
 * consistency. To do operation on traces in same trace group, prefer to use `concat(...)`
 * @param base the index of trace to make concat.
 * @param add the trace to be added to the trace in trace group.
 * @param trg the trace group to operate.
 * @param leftToRight if true, then the dots in the trace inside the trace group come first before dots of added trace,
 * reversed order otherwise.
 */
export const crossConcat = (
  base: number,
  add: Trace.Type,
  trg: TraceGroup.Type,
  leftToRight = true,
): void => {
  if (!Number.isInteger(base)) {
    throw new Error();
  }
  if (base < 0 || base >= trg.traces.length) {
    throw new Error();
  } else {
    if (leftToRight) {
      trg.traces[base] = {
        dots: [...trg.traces[base].dots, ...add.dots],
      };
    } else {
      trg.traces[base] = {
        dots: [...add.dots, ...trg.traces[base].dots],
      };
    }
  }
};

// La fonction append peut être fait avec la méthode JavaScript push(...data)

// La fonction remove peut être fait avec la méthode JavaScript splice(index, 1)

/**
 * Move a trace to a trace group.
 * [Warning]: this operation won't change the old trace, you may need to remove it from its ancient trace group to maintain
 * consistency.
 * @param trg the trace group to be inserted.
 * @param tr the trace to insert into this trace group.
 * @param at the position of insertion, could be omitted. If omitted, the insertion will take place in the tail of the trace
 * group.
 */
export const move = (
  trg: TraceGroup.Type,
  tr: Trace.Type,
  at?: number,
): void => {
  if (at !== undefined && !Number.isInteger(at)) {
    throw new Error();
  } else {
    if (at === undefined) {
      at = trg.traces.length - 1;
    }
    if (at < 0 || at >= trg.traces.length) {
      throw new Error();
    } else {
      trg.traces.splice(at, 0, tr);
    }
  }
};

/**
 * Make an annotation with a given string on a trace group.
 * @param chr the letter (in string) to be annotated.
 * @param tg the trace group to be annotated.
 */
export const annotate = (chr: string, tg: TraceGroup.Type): void => {
  tg.label = constructLetter(chr);
};

/**
 * Mark a trace group as a noise.
 * @param tg the trace group to be marked.
 */
export const makeNoise = (tg: TraceGroup.Type): void => {
  tg.label = noise;
};

/**
 * Erase annotation on a trace group, make it in pending state.
 * @param tg the trace group to be erased.
 */
export const eraseAnnotation = (tg: TraceGroup.Type): void => {
  tg.label = pendingChar;
};

/**
 * Add an empty trace group at a given position in a word.
 * @param word the word to operate.
 * @param at the position to add this empty trace group.
 */
export const addAnnotationUnit = (word: Word.Type, at?: number): void => {
  if (at !== undefined && !Number.isInteger(at)) {
    throw new Error();
  } else {
    if (at === undefined) {
      at = word.tracegroups.length - 1;
    }
    word.tracegroups.splice(at, 0, createEmptyTraceGroup());
  }
};

/**
 * Remove a trace group from a word. All traces in this trace group will be inserted into default trace group in sorted
 * way and the annotation is lost.
 * @param word the word to operate.
 * @param at the index of the trace group to be removed, if omitted, then the last trace group is removed.
 */
export const removeAnnotationUnit = (word: Word.Type, at?: number): void => {
  if (at !== undefined && !Number.isInteger(at)) {
    throw new Error();
  } else {
    if (at === undefined) {
      at = word.tracegroups.length - 1;
    }
    word.defaultTraceGroup = [
      ...word.defaultTraceGroup,
      ...word.tracegroups[at].traces,
    ].sort((a, b) => {
      if (a.dots[0].t < b.dots[0].t) {
        return -1;
      }
      if (a.dots[0].t > b.dots[0].t) {
        return 1;
      }
      return 0;
    });
    word.tracegroups.splice(at, 1);
  }
};

/**
 * Get the pre-selected point of a trace, i.e. the first dot of trace with the lowest timestamp.
 * @param tg the trace group to inspect.
 */
export const preselect = (tg: TraceGroup.Type): Trace.Type => {
  return tg.traces.sort((a, b) => {
    if (a.dots[0].t < b.dots[0].t) {
      return -1;
    }
    if (a.dots[0].t > b.dots[0].t) {
      return 1;
    }
    return 0;
  })[0];
};
