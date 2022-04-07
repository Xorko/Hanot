import * as Trace from './trace';
import {Char} from './char';

interface TraceGroup {
  traces: Trace.Type[];
  label: Char;
}

export type Type = TraceGroup;
