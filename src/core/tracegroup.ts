import * as Trace from './trace';

interface TraceGroup {
  readonly traces: Trace.Type[];
  readonly label: string;
}

export type Type = TraceGroup;
