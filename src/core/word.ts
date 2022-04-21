import { SerializableMap } from '../types/core-types';
import * as Trace from './trace';
import * as TraceGroup from './tracegroup';
import * as XMLAnnotation from './xml-annotation';

/**
 * A data type to represent a word, this type contains a list of trace groups and some meta data for this word
 */
interface Word {
  tracegroups: TraceGroup.Type[];
  readonly annotationsXML?: XMLAnnotation.Type;
  readonly annotations: SerializableMap<string>;
  readonly attributes: SerializableMap<any>;

  readonly predicted?: string;

  defaultTraceGroup: Trace.Type[];
}

export type Type = Word;
