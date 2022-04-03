import * as Char from './char';
import * as Trace from './trace';

interface TraceGroup {
  traces: Trace.Type[];
  label: Char.Type;
}

export type Type = TraceGroup;
