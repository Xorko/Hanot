import { SerializableMap } from '../types/core-types';

interface XMLAnnotation {
  readonly type: string;
  readonly values: SerializableMap<string>;
}

export type Type = XMLAnnotation;
