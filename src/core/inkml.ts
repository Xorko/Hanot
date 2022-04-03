import * as Word from './word';

interface InkML {
  readonly words: Word.Type[];
}

export type Type = InkML;
