interface XMLAnnotation {
  readonly type: string;
  readonly values: Map<string, string>;
}

export type Type = XMLAnnotation;
