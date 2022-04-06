/*
 * A Char represents a content of an annotation unit, it could be some noise, a letter or something of pending char
 */

interface Noise {
  readonly type: 'Noise';
}

interface Pending {
  readonly type: 'PendingCharacter';
}

interface Letter {
  readonly type: 'Letter';
  readonly value: string;
}

type Char = Noise | Letter | Pending;

export type Type = Char;

/**
 * Default constructor for noise
 */
export const noise = { type: 'Noise' } as Noise;
/**
 * Default constructor for pending char
 */
export const pendingChar = { type: 'PendingCharacter' } as Pending;

/**
 * Construct a letter type with a given string as its content
 * @param l a string, expects a single letter or syllabic unit
 */
export const constructLetter = (l: string) => {
  if (l !== '#noise') {
    return {
      type: 'Letter',
      value: l,
    } as Letter;
  } else {
    return noise;
  }
};

/**
 * Says if a char is a letter
 * @param c the char
 */
export const isLetter = (c: Char) => {
  return c.type === 'Letter';
};

/**
 * Says if a char is pending char
 * @param c the char
 */
export const isPending = (c: Char) => {
  return c.type === 'PendingCharacter';
};

/**
 * Says if a char is a noise
 * @param c the char
 */
export const isNoise = (c: Char) => {
  return c.type === 'Noise';
};

/**
 * Get the inner content of a char, if it's a noise, return '#noise', if it's pending, return undefined
 * @param x the char
 */
export const getChar = (x: Char): string | undefined => {
  if (x.type === 'Letter') {
    return x.value;
  } else if (x.type === 'Noise') {
    return '#noise';
  } else {
    return undefined;
  }
};
