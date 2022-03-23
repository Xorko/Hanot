import * as Word from './word';

/**
 * An inkml data type
 */
interface InkML {
  words: Word.Type[];
}

export type Type = InkML;
