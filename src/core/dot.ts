/**
 * A data type of a dot, with x, y, f, t values
 */
interface Dot {
  readonly x: number;
  readonly y: number;
  readonly f: number;
  readonly t: number;
}

export type Type = Dot;
