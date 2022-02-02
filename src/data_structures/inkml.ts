import {
  Chan,
  ST,
  ST_Attributes2,
  ST_Ink,
  ST_Trace,
  ST_TraceGroup,
} from './starter';
import {randomUUID} from 'crypto';

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

const constructLetter = (l: string) =>
  ({
    type: 'Letter',
    value: l,
  } as Letter);

const isLetterOrNoise = (c: Char) => {
  return c.type === 'Letter' || c.type === 'Noise';
};

const noise = {type: 'Noise'} as Noise;
const pendingChar = {type: 'PendingCharacter'} as Pending;

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
    this.uuid = randomUUID();
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

class Ink {
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

  // Get all uuids for use of reference
  uuids(): string[] {
    return this.traceGroup.traceGroups.flatMap(e => e.traces);
  }

  // Get all traces for rendering
  traces(): Dot[][] {
    return this.traceGroup.dots.map(e => e.elements);
  }

  // Get all annotations for rendering
  annotas(): string[] {
    return this.traceGroup.traceGroups
      .filter(e => e.position !== undefined)
      .sort(e => e.position ?? -1)
      .map(e => getChar(e.anno)) as string[];
  }

  // Get current rightmost index
  rightmost(): number {
    return this.traceGroup.rightmostIndex;
  }

  // Get annotation info from given index
  getAnnotation(index: number): AnnoUnit {
    const r = this.traceGroup.traceGroups.find(e => e.position === index);
    if (r === undefined) {
      throw new Error(
        'Error: index out of range or unknown index for annotation',
      );
    }
    return r;
  }

  // Get trace by uuid
  getTrace(uuid: string): Dot[] | undefined {
    return this.traceGroup.dots.find(e => e.uuid === uuid)?.elements;
  }

  // Split a trace into two traces
  split(at: number, uuid: string) {
    // Check if in range
    // Check if uuid exists

    const t = this.traceGroup.dots.find(e => e.uuid === uuid);
    if (t !== undefined) {
      const t1 = new DotList(t.elements.slice(0, at));
      const t2 = new DotList(t.elements.slice(at));
      this.traceGroup.dots.splice(this.traceGroup.dots.indexOf(t));
      this.traceGroup.dots.push(t1, t2);
      const u = this.traceGroup.traceGroups.find(e =>
        e.traces.includes(uuid),
      )?.traces;
      if (u !== undefined) {
        u.splice(u.indexOf(uuid));
        u.push(t1.uuid, t2.uuid);
      }
    }
  }

  // Test if an annotation unit contains a trace
  containsTrace(uuid: string, index: number): boolean {
    return !!this.traceGroup.traceGroups
      .find(e => e.position === index)
      ?.traces.includes(uuid);
  }

  // Append a trace into an annotation unit
  append(uuid: string, index: number) {
    // Check if uuid exists
    // If trace belongs to another unit, remove it

    this.traceGroup.traceGroups
      .find(e => e.position === index)
      ?.traces.push(uuid);
  }

  // Remove a trace from an annotation unit
  remove(uuid: string, index: number) {
    // Check if uuid exists

    const t = this.traceGroup.traceGroups.find(
      e => e.position === index,
    )?.traces;
    t?.splice(t?.indexOf(uuid));
  }

  // Update the annotation with a char
  annotate(chr: string, at: number) {
    const au = this.traceGroup.traceGroups.find(e => e.position === at);
    if (au !== undefined) {
      au.anno = constructLetter(chr);
    }
  }

  // Define an annotation unit as noise
  makeNoise(at: number) {
    const au = this.traceGroup.traceGroups.find(e => e.position === at);
    if (au !== undefined) {
      au.anno = noise;
    }
  }

  // Remove annotation (back to pending status)
  removeAnnotation(at: number) {
    const au = this.traceGroup.traceGroups.find(e => e.position === at);
    if (au !== undefined) {
      au.anno = pendingChar;
    }
  }

  /* Integrity checks */

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

// TODO convert back to inkml

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
