/**
 * A data type to represent the xml annotations in an inkml
 */
interface XMLAnnotation {
  readonly type: string;
  readonly values: Map<string, string>;
}

export type Type = XMLAnnotation;
