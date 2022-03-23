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

export const constructLetter = (l: string) =>
  ({
    type: 'Letter',
    value: l,
  } as Letter);

export const isLetter = (c: Char) => {
  return c.type === 'Letter';
};

export const isNoise = (c: Char) => {
  return c.type === 'Noise';
};

export const noise = { type: 'Noise' } as Noise;
export const pendingChar = { type: 'PendingCharacter' } as Pending;

export const getChar = (x: Char): string | undefined => {
  if (x.type === 'Letter') {
    return x.value;
  } else if (x.type === 'Noise') {
    return '#noise';
  } else {
    return undefined;
  }
};

export type Char = Noise | Letter | Pending;
