import type {SerializableMap} from '../types/file-import-types';

interface XMLAnnotation {
  readonly type: string;
  readonly values: SerializableMap<string>;
}

export type Type = XMLAnnotation;
