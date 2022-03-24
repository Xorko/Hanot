import * as Dot from '../core/dot';
import * as InkML from '../core/inkml';
import * as Trace from '../core/trace';
import * as TraceGroup from '../core/tracegroup';
import * as Word from '../core/word';
import { AnnoData, InkData, TraceGroupData } from '../core/data';
import { constructLetter, noise, pendingChar } from '../core/char';

export const constructData = (ink?: InkData): InkML.Type | undefined => {
  if (ink !== undefined) {
    const anno = makeAnnotations(ink.annotation);
    return {
      words: makeWords(ink.traceGroup, anno),
    };
  } else {
    return undefined;
  }
};

const makeWords = (
  tg: TraceGroupData | TraceGroupData[],
  anno?: Map<string, string>,
): Word.Type[] => {
  if (Array.isArray(tg)) {
    return tg.map(e => makeSingleWord(e, anno));
  } else {
    return [makeSingleWord(tg, anno)];
  }
};

const makeSingleWord = (
  tg: TraceGroupData,
  anno?: Map<string, string>,
): Word.Type => {
  const predicted = tg.attr?.['xml:id'];
  const attrs = new Map<string, any>();
  if (tg.attr !== undefined) {
    for (const [k, v] of Object.entries(tg.attr)) {
      if (!['xml:id', 'positionInGroundTruthValue', 'noise'].includes(k)) {
        attrs.set(k, v);
      }
    }
  }
  let annoXML;
  if (tg.annotationXML !== undefined) {
    annoXML = {
      type: tg.annotationXML.attr.type,
      values:
        makeAnnotations(tg.annotationXML.annotation) ??
        new Map<string, string>(),
    };
  }
  const [traceGroups, danglingTraces] = constructTraceGroups(tg);
  return {
    tracegroups: traceGroups,
    annotationsXML: annoXML,
    annotations:
      anno ?? makeAnnotations(tg.annotation) ?? new Map<string, string>(),
    attributes: attrs,
    predicted: predicted,
    defaultTraceGroup: [...danglingTraces, ...constructDefaultTraceGroup(tg)],
  };
};

const makeAnnotations = (
  annos?: AnnoData[],
): Map<string, string> | undefined => {
  return annos?.reduce(
    (map, e) => map.set(e.attr.type, e['#text']),
    new Map<string, string>(),
  );
};

const constructTraceGroups = (
  tg: TraceGroupData,
): [TraceGroup.Type[], Trace.Type[]] => {
  if (Array.isArray(tg.traceGroup)) {
    return constructTraceGroupFromTraceGroupArray(tg.traceGroup);
  } else if (tg.traceGroup !== undefined) {
    const ret = constructTraceGroupFromTraceGroup(tg.traceGroup);
    return [ret[0], ret[2]];
  } else {
    return [[], []];
  }
};

const constructDefaultTraceGroup = (tg: TraceGroupData): Trace.Type[] => {
  if (Array.isArray(tg.trace)) {
    return tg.trace.map(x => constructTrace(x));
  } else if (tg.trace !== undefined) {
    return [constructTrace(tg.trace)];
  } else {
    return [];
  }
};

const constructTraceGroupFromTraceGroupArray = (
  tg: TraceGroupData[],
): [TraceGroup.Type[], Trace.Type[]] => {
  const nullableTraceGroupWithIndex = tg.map(c =>
    constructTraceGroupFromTraceGroup(c),
  );
  const availableTraceGroups = nullableTraceGroupWithIndex.filter(
    e => e[1] !== undefined,
  );
  const danglingTraces = nullableTraceGroupWithIndex
    .filter(e => e[2] !== undefined)
    .map(e => e[2][0]);
  return [reconstructTracesInOrder(availableTraceGroups), danglingTraces];
};

const constructTraceGroupFromTraceGroup = (
  tg: TraceGroupData,
): [TraceGroup.Type[], number[], Trace.Type[]] => {
  const xmlid = tg.attr?.['xml:id'];
  const pos = tg.attr?.positionInGroundTruthValue;
  const noise_ = tg.attr?.noise;
  let trace: Trace.Type[] = [];
  if (Array.isArray(tg.trace)) {
    trace = tg.trace.map(constructTrace);
  } else if (tg.trace !== undefined) {
    trace = [constructTrace(tg.trace)];
  }
  if (pos !== undefined && xmlid !== undefined && noise_ === undefined) {
    return [
      [
        {
          traces: trace,
          label: constructLetter(xmlid),
        },
      ],
      [pos],
      [],
    ];
  } else if (pos !== undefined && xmlid === undefined && noise_ !== undefined) {
    return [
      [
        {
          traces: trace,
          label: noise,
        },
      ],
      [pos],
      [],
    ];
  } else if (pos === undefined && xmlid === undefined && noise_ === undefined) {
    return [[], [], trace];
  } else {
    throw new Error('Impossible case');
  }
};

const constructTrace = (tr: string): Trace.Type => {
  return {
    dots: tr
      .split(',')
      .map(xxs =>
        xxs
          .split(' ')
          .filter(e => e !== '')
          .map(e => parseFloat(e)),
      )
      .map(constructDot),
  };
};

const constructDot = (nx: number[]): Dot.Type => {
  return {
    x: nx[0],
    y: nx[1],
    f: nx[1],
    t: nx[2],
  };
};

const reconstructTracesInOrder = (
  tdata: [TraceGroup.Type[], number[], Trace.Type[]][],
): TraceGroup.Type[] => {
  const nonEmptyTraceGroups = tdata.filter(
    e => e[1] !== undefined && e[2] !== undefined,
  );
  const rightmost = max(nonEmptyTraceGroups.map(e => e[1][0]));
  const traceGroupForms: [TraceGroup.Type, number][] = nonEmptyTraceGroups.map(
    e => [e[0][0], e[1][0]],
  );
  const orderedTraceGroups: TraceGroup.Type[] = [];
  for (const i of Array.from(Array(rightmost).keys())) {
    const curr = traceGroupForms.find(e => e[1] === i);
    if (curr !== undefined) {
      orderedTraceGroups.push(curr[0]);
    } else {
      orderedTraceGroups.push(createEmptyTraceGroup());
    }
  }
  return orderedTraceGroups;
};

export const createEmptyTraceGroup = (
  traces?: Trace.Type[],
): TraceGroup.Type => {
  return {
    traces: traces ?? [],
    label: pendingChar,
  };
};

const max = (a: number[]): number => {
  let maxValue = a[0];
  for (const x of a) {
    if (x > maxValue) {
      maxValue = x;
    }
  }
  return maxValue;
};
