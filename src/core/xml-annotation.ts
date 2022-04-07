import type {StringMap} from '../types/types';

interface XMLAnnotation {
  readonly type: string;
  readonly values: StringMap;
}

export type Type = XMLAnnotation;
