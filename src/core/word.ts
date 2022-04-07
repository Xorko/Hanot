import type {SerializableMap} from '../types/types';
import * as Trace from './trace';
import * as TraceGroup from './tracegroup';
import * as XMLAnnotation from './xml-annotation';

interface Word {
  tracegroups: TraceGroup.Type[];
  readonly annotationsXML?: XMLAnnotation.Type;
  readonly annotations: SerializableMap<string>;
  readonly attributes: SerializableMap<any>;

  readonly  predicted: string | undefined;

  defaultTraceGroup: Trace.Type[];
}

export type Type = Word;
