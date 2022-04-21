import type { SerializableMap } from '../screens/file-selection-screen/types/file-import-types';

/**
 * A data type to represent the xml annotations in an inkml
 */
interface XMLAnnotation {
  readonly type: string;
  readonly values: SerializableMap<string>;
}

export type Type = XMLAnnotation;
