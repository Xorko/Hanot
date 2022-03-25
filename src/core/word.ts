import * as Trace from './trace';
import * as TraceGroup from './tracegroup';
import * as XMLAnnotation from './xml-annotation';

interface Word {
  readonly tracegroups: TraceGroup.Type[];
  readonly annotationsXML?: XMLAnnotation.Type;
  readonly annotations: Map<string, string>;
  readonly attributes: Map<string, any>;
  readonly predicted?: string;

  defaultTraceGroup: Trace.Type[];
}

export type Type = Word;
