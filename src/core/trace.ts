import * as Dot from './dot';

/**
 * A data type to represent a trace i.e. a list of dots
 */
interface Trace {
  readonly dots: Dot.Type[];
}

export type Type = Trace;
