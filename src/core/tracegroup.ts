import * as Char from './char';
import * as Trace from './trace';

/**
 * A data type to represent a trace group, with a list of trace and its annotation
 */
interface TraceGroup {
  traces: Trace.Type[];
  label: Char.Type;
}

export type Type = TraceGroup;
