import * as Dot from './dot';

/**
 * A data type to represent a trace i.e. a list of dots
 */
interface Trace {
  dots: Dot.Type[];
  oldTrace: number;
}

export type Type = Trace;
