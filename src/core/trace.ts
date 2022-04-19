import * as Dot from './dot';

interface Trace {
  dots: Dot.Type[];
  oldTrace: number;
}

export type Type = Trace;
