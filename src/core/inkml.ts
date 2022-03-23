import * as Word from './word';
import * as Annotation from './annotation';
import * as XMLAnnotation from './xml-annotation';

interface InkML {
  readonly words: Word.Type[];
  readonly XMLAnnotations: XMLAnnotation.Type[];
  readonly annotations: Annotation.Type[];
}

export type Type = InkML