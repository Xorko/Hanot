import assert from 'assert';
import rnUuid from 'react-native-uuid';
import {
  Chan,
  ST,
  ST_Attributes2,
  ST_Ink,
  ST_Trace,
  ST_TraceGroup,
} from './starter';

const {v4: uuidv4} = rnUuid;
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

export const isLetterOrNoise = (c: Char) => {
  return c.type === 'Letter' || c.type === 'Noise';
};

export const noise = {type: 'Noise'} as Noise;
export const pendingChar = {type: 'PendingCharacter'} as Pending;

type Char = Noise | Letter | Pending;

class Dot {
  readonly x: number;
  readonly y: number;
  readonly f: number;
  readonly t: number;

  constructor(x: number, y: number, f: number, t: number) {
    this.x = x;
    this.y = y;
    this.f = f;
    this.t = t;
  }
}

class DotList {
  readonly elements: Dot[];
  readonly uuid: string;

  constructor(elements: Dot[]) {
    this.elements = elements;
    this.uuid = uuidv4() as string;
  }
}

class AnnoUnit {
  traces: string[];

  position?: number;

  anno: Char;

  constructor(traces: string[], position?: number, anno?: string) {
    this.traces = traces;
    this.position = position;
    if (anno === undefined) {
      this.anno = pendingChar;
    } else if (anno === '#noise') {
      this.anno = noise;
    } else {
      this.anno = constructLetter(anno);
    }
  }
}

class Traces {
  predicted: string;
  annotations: Map<string, string>;
  dots: DotList[];
  traceGroups: AnnoUnit[];

  rightmostIndex: number;

  // traceGroups: [xml:id, DotList[]]
  constructor(
    predicted: string,
    traceGroups: [DotList[], number?, string?][],
    anno?: Map<string, string>,
  ) {
    this.predicted = predicted;
    this.dots = traceGroups.flatMap(e => e[0]);
    this.annotations = anno ?? new Map<string, string>();
    this.traceGroups = traceGroups.map(
      e =>
        new AnnoUnit(
          e[0].map(f => f.uuid),
          e[1],
          e[2],
        ),
    );
    let rightmost = -1;
    this.traceGroups
      .map(e => e.position ?? -1)
      .forEach(e => {
        if (e > rightmost) {
          rightmost = e;
        }
      });
    this.rightmostIndex = rightmost;
  }
}

export class Ink {
  annotations: Map<string, string> = new Map<string, string>();
  // traces: Traces
  traceGroup: Traces;

  constructor(ink: ST_Ink) {
    this.annotations = ink.annotation.reduce(
      (map, e) => map.set(e.attr.type, e['#text']),
      new Map<string, string>(),
    );
    const pred = ink?.traceGroup?.attr['xml:id'] ?? '';
    const prepare = constructTraceGroup(ink.traceGroup as ST_TraceGroup);
    this.traceGroup = new Traces(pred, prepare[0], prepare[1]);
  }

  /* API goes here */

  /**
   * Get all uuids for use of reference
   */
  public uuids(): string[] {
    return this.traceGroup.traceGroups.flatMap(e => e.traces);
  }

  /**
   * Get all traces for rendering
   */
  public traces(): Dot[][] {
    return this.traceGroup.dots.map(e => e.elements);
  }

  /**
   * Get all annotations for rendering
   */
  public annotas(): string[] {
    return this.traceGroup.traceGroups
      .filter(e => e.position !== undefined)
      .sort(e => e.position ?? -1)
      .map(e => getChar(e.anno)) as string[];
  }

  /**
   * Get current rightmost index
   */
  public rightmost(): number {
    return this.traceGroup.rightmostIndex;
  }

  /**
   * Get annotation info from given index
   * @param index : int the position of requested annotation
   */
  public getAnnotation(index: number): AnnoUnit {
    assert(
      Number.isInteger(index),
      'Ink::getAnnotation Error: the index passed is supposed to be an int',
    );
    const r = this.traceGroup.traceGroups.find(e => e.position === index);
    if (r === undefined) {
      throw new Error(
        'Ink::getAnnotation Error: index out of range or unknown index for annotation',
      );
    }
    return r;
  }

  /**
   * Get trace by uuid, the trace is a collection of Dot data type
   * @param uuid the unique id that is associated with this trace
   */
  public getTrace(uuid: string): Dot[] | undefined {
    return this.traceGroup.dots.find(e => e.uuid === uuid)?.elements;
  }

  /**
   * Split a trace into two traces
   * @param at the position of the trace where it should be split by two. This position is inclusive for the remaining
   * and exclusive for the first part.
   * @param uuid the unique id that is associated with this trace
   * @return [uuid, uuid] a pair of two new generated uuids for new traces
   * @throws Error if the uuid could not be found, the uuid is not associated by any annotation group, or the position is
   * out of range
   */
  public split(at: number, uuid: string): [string, string] {
    // Check if in range
    // Check if uuid exists

    const t = this.traceGroup.dots.find(e => e.uuid === uuid);
    if (t === undefined) {
      throw new Error('Ink::split Error: unknown uuid, no trace matched');
    } else {
      // prettier-ignore
      const u = this.traceGroup.traceGroups.find(e => e.traces.includes(uuid))?.traces;
      if (u === undefined) {
        throw new Error(
          'Ink::split Error: wrong internal state, attempt to split a trace which belongs to no annotation unit',
        );
      } else {
        if (!Number.isInteger(at)) {
          throw new Error('Ink::split Error: passed index should be an int');
        } else if (at < 0 || at >= t.elements.length) {
          throw new Error('Ink::split Error: supplied index is out of range');
        }
        const t1 = new DotList(t.elements.slice(0, at));
        const t2 = new DotList(t.elements.slice(at));
        this.traceGroup.dots.splice(this.traceGroup.dots.indexOf(t));
        this.traceGroup.dots.push(t1, t2);
        u.splice(u.indexOf(uuid));
        u.push(t1.uuid, t2.uuid);
        return [t1.uuid, t2.uuid];
      }
    }
  }

  /**
   * Test if an annotation unit contains a trace
   * @param uuid the uuid of the trace to be tested
   * @param index the index of the annotation unit to be tested
   * @return true if the trace is part of the annotation unit, otherwise false
   */
  public containsTrace(uuid: string, index: number): boolean {
    return !!this.traceGroup.traceGroups
      .find(e => e.position === index)
      ?.traces.includes(uuid);
  }

  /**
   * Append a trace into an annotation unit
   * @param uuid the uuid of the trace to be append
   * @param index the index of the annotation unit to be append
   */
  public append(uuid: string, index: number) {
    // Check if uuid exists
    if (this.traceGroup.dots.find(e => e.uuid === uuid) === undefined) {
      throw new Error('Ink::append Error: unknown uuid');
    }
    // If trace belongs to another unit, remove it
    if (this.containsTrace(uuid, index)) {
      this.remove(uuid, index);
    }

    this.traceGroup.traceGroups
      .find(e => e.position === index)
      ?.traces.push(uuid);
  }

  /**
   * Remove a trace from an annotation unit
   * @param uuid the uuid of the trace to be removed
   * @param index the index of annotation unit to remove
   */
  public remove(uuid: string, index: number) {
    // Check if uuid exists
    if (this.traceGroup.dots.find(e => e.uuid === uuid) === undefined) {
      throw new Error('Ink::remove Error: unknown uuid');
    }

    const t = this.traceGroup.traceGroups.find(
      e => e.position === index,
    )?.traces;
    t?.splice(t?.indexOf(uuid));
  }

  /**
   * Update the annotation with a char
   * @param chr the annotation to be annotated
   * @param at the index of annotation
   * @return the generated annotation unit
   */
  public annotate(chr: string, at: number): AnnoUnit {
    const au = this.traceGroup.traceGroups.find(e => e.position === at);
    if (au !== undefined) {
      au.anno = constructLetter(chr);
      return au;
    } else {
      throw new Error('Ink::annotate Error: unknown index');
    }
  }

  /**
   * Define an annotation unit as noise
   * @param at the position of annotation
   * @return the generated annotation unit
   */
  public makeNoise(at: number): AnnoUnit {
    const au = this.traceGroup.traceGroups.find(e => e.position === at);
    if (au !== undefined) {
      au.anno = noise;
      return au;
    } else {
      throw new Error('Ink::makeNoise Error: unknown index');
    }
  }

  /**
   * Remove annotation (back to pending status)
   * @param at the position of annotation to be removed, i.e. change to pending status
   * Notice that we never "really remove" something
   */
  public removeAnnotation(at: number) {
    const au = this.traceGroup.traceGroups.find(e => e.position === at);
    if (au !== undefined) {
      au.anno = pendingChar;
    } else {
      throw new Error('Ink::removeAnnotation Error: unknown index');
    }
  }

  /* TODO Integrity checks, private methods.. */

  // Indices span from 0 to number of nonnull annotations

  // Index count to -1 if all annotations are null
}

type PrepareTrace = [[DotList[], number?, string?][], Map<string, string>];

const constructTraceGroup = (ts: ST_TraceGroup): PrepareTrace => {
  const anno = new Map<string, string>();
  ts?.annotationXML?.annotation.forEach(v => anno.set(v.attr.type, v['#text']));
  let tx: [DotList[], number?, string?][] = [];
  if (Array.isArray(ts.traceGroup)) {
    tx = constructTraceGroupFromTraceGroupArray(ts.traceGroup);
  } else if (ts.traceGroup !== undefined) {
    tx = constructTraceGroupFromTraceGroup(ts.traceGroup);
  }
  let ty: DotList[] = [];
  if (Array.isArray(ts.trace)) {
    ty = ts.trace.map(x => constructDotList(x));
  } else if (ts.trace !== undefined) {
    ty = [constructDotList(ts.trace)];
  }
  const tyy: [DotList[], number?, string?][] = [ty].map(e => [
    e,
    undefined,
    undefined,
  ]);
  return [tx.concat(tyy), anno];
};

const constructTraceGroupFromTraceGroupArray = (
  ts: ST_Trace[],
): [DotList[], number?, string?][] => {
  return ts.map(c => constructTraceGroupFromTraceGroup(c)).map(e => e[0]);
};

const constructTraceGroupFromTraceGroup = (
  ts: ST_Trace,
): [DotList[], number?, string?][] => {
  const xmlid = ts.attr['xml:id'];
  const pos = ts.attr.positionInGroundTruthValue;
  let trace: any[];
  if (Array.isArray(ts.trace)) {
    trace = ts.trace.map(x => constructDotList(x));
  } else {
    trace = [constructDotList(ts.trace)];
  }
  return [[trace, pos, xmlid]];
};

const constructDotList = (xs: string): DotList => {
  return new DotList(
    xs
      .split(',')
      .map(xxs =>
        xxs
          .split(' ')
          .filter(e => e !== '')
          .map(e => parseFloat(e)),
      )
      .map(e => new Dot(e[0], e[1], e[2], e[3])),
  );
};

export const constructData = (ink: ST_Ink): Ink => {
  return new Ink(ink);
};

/* API for convert back to inkml entrypoint */

export const exportInk = (ink: Ink): ST => {
  const t = exportTraceGroup(ink.traceGroup);
  const i: ST_Ink = {
    attr: {xmlns: 'http://www.w3.org/2003/InkML'},
    traceFormat: {
      channel: [
        {attr: {name: Chan.X, type: 'decimal' as const}},
        {attr: {name: Chan.Y, type: 'decimal' as const}},
        {attr: {name: Chan.F, type: 'decimal' as const}},
        {attr: {name: Chan.T, type: 'integer' as const}},
      ],
    },
    annotation: [],
    traceGroup: t,
  };
  return {ink: i};
};

const exportTraceGroup = (tg: Traces): ST_TraceGroup => {
  const annotated = aggregateAnnotated(tg.traceGroups);
  const uncommented = findUncommented(annotated, tg.dots);

  const traces = tg.traceGroups
    .filter(a => isLetterOrNoise(a.anno))
    .sort(a => a.position ?? 99999999)
    .map(a => {
      const xmlid = getChar(a.anno);
      const position = a.position;
      const tx = a.traces
        .map(u =>
          tg.dots
            .find(e => e.uuid === u)
            ?.elements.map(d => `${d.x} ${d.y} ${d.f} ${d.t}`)
            .join(' ,'),
        )
        .filter(x => x !== undefined) as string[];
      let tr: string | string[];
      if (tx.length === 1) {
        tr = tx[0];
      } else {
        tr = tx;
      }
      if (xmlid !== undefined) {
        if (position !== undefined) {
          return {
            attr: {
              'xml:id': xmlid,
              positionInGroundTruthValue: position,
            },
            trace: tr,
          };
        } else {
          return {
            attr: {
              'xml:id': xmlid,
            },
            trace: tr,
          };
        }
      } else {
        throw new Error(
          'Attempt to export a trace which has not been annotated yet',
        );
      }
    });
  const annotations: ST_Attributes2[] = [];
  tg.annotations.forEach((v, k) =>
    annotations.push({
      '#text': v,
      attr: {
        type: k,
      },
    }),
  );
  const attr = tg.predicted;
  if (annotations.length === 0) {
    return {
      attr: {
        'xml:id': attr,
      },
      traceGroup: traces,
      trace: uncommented.map(e =>
        e.elements.map(d => `${d.x} ${d.y} ${d.f} ${d.t}`).join(' ,'),
      ),
    };
  } else {
    return {
      attr: {
        'xml:id': attr,
      },
      annotationXML: {
        attr: {
          type: 'groundTruth',
        },
        annotation: annotations,
      },
      traceGroup: traces,
      trace: uncommented.map(e =>
        e.elements.map(d => `${d.x} ${d.y} ${d.f} ${d.t}`).join(' ,'),
      ),
    };
  }
};

const getChar = (x: Char): string | undefined => {
  if (x.type === 'Letter') {
    return x.value;
  } else if (x.type === 'Noise') {
    return '#noise';
  } else {
    return undefined;
  }
};

const aggregateAnnotated = (anno: AnnoUnit[]): string[] => {
  const xs: [Char, string[]][] = anno.map(e => [e.anno, e.traces]);
  return xs.filter(e => isLetterOrNoise(e[0])).flatMap(e => e[1]);
};

const findUncommented = (uuids: string[], traces: DotList[]): DotList[] => {
  return traces.filter(e => !uuids.includes(e.uuid));
};
