import type {SerializableMap} from '../types/types';
import * as Trace from './trace';
import * as TraceGroup from './tracegroup';
import * as XMLAnnotation from './xml-annotation';

interface Word {
  tracegroups: TraceGroup.Type[];
  annotationsXML?: XMLAnnotation.Type;
  annotations: SerializableMap<string>;
  attributes: SerializableMap<any>;

  predicted: string | undefined;

  defaultTraceGroup: Trace.Type[];
}

export type Type = Word;
