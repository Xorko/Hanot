import * as Trace from './trace';
import { Char } from './char';

interface TraceGroup {
  readonly traces: Trace.Type[];
  label: Char;
}

export type Type = TraceGroup;
