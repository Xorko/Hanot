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

export const noise = { type: 'Noise' } as Noise;
export const pendingChar = { type: 'PendingCharacter' } as Pending;

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

export const isLetter = (c: Char) => {
  return c.type === 'Letter';
};

export const isPending = (c: Char) => {
  return c.type === 'PendingCharacter';
};

export const isNoise = (c: Char) => {
  return c.type === 'Noise';
};

export const getChar = (x: Char): string | undefined => {
  if (x.type === 'Letter') {
    return x.value;
  } else if (x.type === 'Noise') {
    return '#noise';
  } else {
    return undefined;
  }
};
