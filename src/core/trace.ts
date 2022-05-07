import * as Dot from './dot';

/**
 * A data type to represent a trace i.e. a list of dots
 */
interface Trace {
  dots: Dot.Type[];
  oldTrace: number;
}

export const createEmptyTrace = (): Trace => ({
  dots: [],
  oldTrace: -1,
});

export type Type = Trace;
