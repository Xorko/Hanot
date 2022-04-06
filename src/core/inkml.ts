import * as Word from './word';

/**
 * An inkml data type
 */
interface InkML {
  readonly words: Word.Type[];
}

export type Type = InkML;
