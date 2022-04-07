import type {AnyMap, StringMap} from '../types/types';
import * as Trace from './trace';
import * as TraceGroup from './tracegroup';
import * as XMLAnnotation from './xml-annotation';

interface Word {
  tracegroups: TraceGroup.Type[];
  annotationsXML?: XMLAnnotation.Type;
  annotations: StringMap;
  attributes: AnyMap;

  predicted: string | undefined;

  defaultTraceGroup: Trace.Type[];
}

export type Type = Word;
