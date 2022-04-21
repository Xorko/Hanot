import { SerializableMap } from '../types/core-types';
import * as Trace from './trace';
import * as TraceGroup from './tracegroup';
import * as XMLAnnotation from './xml-annotation';

interface Word {
  tracegroups: TraceGroup.Type[];
  readonly annotationsXML?: XMLAnnotation.Type;
  readonly annotations: SerializableMap<string>;
  readonly attributes: SerializableMap<any>;

  readonly predicted?: string;

  defaultTraceGroup: Trace.Type[];
}

export type Type = Word;
