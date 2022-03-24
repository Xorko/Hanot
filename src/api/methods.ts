import * as Dot from '../core/dot';
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

export const annotas = (word: Word.Type): string[] => {
  return getAnnotated(word).map(e => getChar(e.label)) as string[];
};

export const rightmost = (word: Word.Type): number => {
  return word.tracegroups.length;
};

export const getWord = (word: Word.Type): string => {
  return annotas(word).join();
};

export const getAnnotated = (word: Word.Type): TraceGroup.Type[] => {
  return word.tracegroups.filter(e => isLetter(e.label));
};

export const getPending = (word: Word.Type): TraceGroup.Type[] => {
  return word.tracegroups.filter(e => isPending(e.label));
};

export const getDefault = (word: Word.Type): Trace.Type[] => {
  return word.defaultTraceGroup;
};

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
        of,
        0,
        createEmptyTraceGroup(word.tracegroups[of].traces.slice(at)),
      );
      word.tracegroups[of].traces.splice(at);
    }
  }
};

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

export const concat = (
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

export const annotate = (chr: string, tg: TraceGroup.Type): void => {
  tg.label = constructLetter(chr);
};

export const makeNoise = (tg: TraceGroup.Type): void => {
  tg.label = noise;
};

export const eraseAnnotation = (tg: TraceGroup.Type): void => {
  tg.label = pendingChar;
};

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

export const removeAnnotationUnit = (word: Word.Type, at?: number): void => {
  if (at !== undefined && !Number.isInteger(at)) {
    throw new Error();
  } else {
    if (at === undefined) {
      at = word.tracegroups.length - 1;
    }
    word.tracegroups.splice(at, 1);
  }
};

export const preselect = (tg: TraceGroup.Type): Dot.Type[] => {
  return tg.traces.sort((a, b) => {
    if (a.dots[0].t < b.dots[0].t) {
      return -1;
    }
    if (a.dots[0].t > b.dots[0].t) {
      return 1;
    }
    return 0;
  })[0].dots;
};
