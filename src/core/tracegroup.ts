import { Char } from './char';
import * as Trace from './trace';

interface TraceGroup {
  traces: Trace.Type[];
  label: Char;
}

export type Type = TraceGroup;
