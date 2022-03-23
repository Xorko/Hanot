import * as Trace from './trace';
import { Char } from './char';

interface TraceGroup {
  readonly traces: Trace.Type[];
  readonly label: Char;
}

export type Type = TraceGroup;
