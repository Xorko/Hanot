import * as Char from './char';
import * as Trace from './trace';

/**
 * A data type to represent a trace group, with a list of trace and its annotation
 */
interface TraceGroup {
  traces: Trace.Type[];
  label: Char.Type;
}

/**
 * Creates an empty trace group with possibly a given list of traces, set to pending char label.
 * @param traces list of traces to be added in the new generated trace group, if omitted then an empty list will be supplied.
 */
export const createEmptyTraceGroup = (traces?: Trace.Type[]): TraceGroup => {
  return {
    traces: traces ?? [],
    label: Char.pendingChar,
  };
};

export type Type = TraceGroup;
