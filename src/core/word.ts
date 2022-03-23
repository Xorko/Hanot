import * as TraceGroup from './tracegroup';

interface Word {
  readonly tracegroups: TraceGroup.Type;
}

export type Type = Word;
