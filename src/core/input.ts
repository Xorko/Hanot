import isEmpty from 'lodash/isEmpty';
import { SerializableMap } from '../types/core-types';
import * as Char from './char';
import * as Data from './data';
import { TraceData } from './data';
import * as Dot from './dot';
import * as InkML from './inkml';
import * as Trace from './trace';
import * as TraceGroup from './tracegroup';
import { createEmptyTraceGroup } from './tracegroup';
import * as Word from './word';

/**
 * Construct an InkML type from the raw json data converted from an inkml file.
 * @param ink the InkData json object to be converted, do nothing if it's undefined.
 */
export const constructData = (ink?: Data.InkData): InkML.Type | undefined => {
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
  tg: Data.TraceGroupData | Data.TraceGroupData[],
  anno?: SerializableMap<string>,
): Word.Type[] => {
  if (Array.isArray(tg)) {
    return tg.map(e => makeSingleWord(e, anno));
  } else {
    return [makeSingleWord(tg, anno)];
  }
};

const makeSingleWord = (
  tg: Data.TraceGroupData,
  anno?: SerializableMap<string>,
): Word.Type => {
  const predicted = tg.attr?.['xml:id'];
  const attrs = {} as SerializableMap<any>;
  if (tg.attr !== undefined) {
    for (const [k, v] of Object.entries(tg.attr)) {
      if (!['xml:id', 'positionInGroundTruthValue', 'noise'].includes(k)) {
        attrs[k] = v;
      }
    }
  }
  let annoXML;
  if (tg.annotationXML !== undefined) {
    annoXML = {
      type: tg.annotationXML.attr.type,
      values:
        makeAnnotations(tg.annotationXML.annotation) ??
        ({} as SerializableMap<string>),
    };
  }
  const [traceGroups, danglingTraces] = constructTraceGroups(tg);
  return {
    tracegroups: traceGroups,
    annotationsXML: annoXML,
    annotations:
      anno ?? makeAnnotations(tg.annotation) ?? ({} as SerializableMap<string>),
    attributes: attrs,
    predicted: predicted,
    defaultTraceGroup: [...danglingTraces, ...constructDefaultTraceGroup(tg)],
  };
};

const makeAnnotations = (
  annos?: Data.AnnoData[],
): SerializableMap<string> | undefined => {
  const ret: SerializableMap<string> = {};

  for (const anno of annos ?? []) {
    if (anno.attr !== undefined) {
      ret[anno.attr.type] = anno['#text'];
    }
  }

  return isEmpty(ret) ? undefined : ret;
};

const constructTraceGroups = (
  tg: Data.TraceGroupData,
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

const constructDefaultTraceGroup = (tg: Data.TraceGroupData): Trace.Type[] => {
  if (Array.isArray(tg.trace)) {
    return tg.trace.map(x => constructTrace(x));
  } else if (tg.trace !== undefined) {
    return [constructTrace(tg.trace)];
  } else {
    return [];
  }
};

const constructTraceGroupFromTraceGroupArray = (
  tg: Data.TraceGroupData[],
): [TraceGroup.Type[], Trace.Type[]] => {
  const nullableTraceGroupWithIndex = tg.map(c =>
    constructTraceGroupFromTraceGroup(c),
  );
  const availableTraceGroups = nullableTraceGroupWithIndex.filter(
    e => e[1].length !== 0,
  );
  const danglingTraces = nullableTraceGroupWithIndex
    .filter(e => e[2].length !== 0)
    .flatMap(e => e[2]);
  return [reconstructTracesInOrder(availableTraceGroups), danglingTraces];
};

const constructTraceGroupFromTraceGroup = (
  tg: Data.TraceGroupData,
): [TraceGroup.Type[], number[], Trace.Type[]] => {
  const xmlid = tg.attr?.['xml:id'];
  const pos = tg.attr?.positionInGroundTruthValue;
  const noise = tg.attr?.noise;
  let trace: Trace.Type[] = [];
  if (Array.isArray(tg.trace)) {
    trace = tg.trace.map(constructTrace);
  } else if (tg.trace !== undefined) {
    trace = [constructTrace(tg.trace)];
  }
  if (pos !== undefined && xmlid !== undefined && noise === undefined) {
    return [
      [
        {
          traces: trace,
          label: Char.constructLetter(xmlid),
        },
      ],
      [pos],
      [],
    ];
  } else if (pos !== undefined && xmlid === undefined && noise !== undefined) {
    return [
      [
        {
          traces: trace,
          label: Char.noise,
        },
      ],
      [pos],
      [],
    ];
  } else if (pos === undefined && xmlid === undefined && noise === undefined) {
    return [[], [], trace];
  } else {
    throw new Error('Impossible case');
  }
};

const constructTrace = (tr: string | TraceData): Trace.Type => {
  if (typeof tr === 'string') {
    return {
      dots: constructTraceFromString(tr),
      oldTrace: -1,
    };
  } else {
    return {
      dots: constructTraceFromString(tr['#text']),
      oldTrace: parseInt(tr.attr.oldTrace, 10),
    };
  }
};

const constructTraceFromString = (s: string) => {
  if (!s) {
    return [];
  }

  return s
    .split(',')
    .map(xxs =>
      xxs
        .split(' ')
        .filter(e => e !== '')
        .map(e => parseFloat(e)),
    )
    .map(constructDot);
};

const constructDot = (nx: number[]): Dot.Type => {
  return {
    x: nx[0],
    y: nx[1],
    f: nx[2],
    t: nx[3],
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
  if (rightmost !== undefined) {
    for (const i of Array.from(Array(rightmost + 1).keys())) {
      const curr = traceGroupForms.find(e => e[1] === i);
      if (curr !== undefined) {
        orderedTraceGroups.push(curr[0]);
      } else {
        orderedTraceGroups.push(createEmptyTraceGroup());
      }
    }
  }
  return orderedTraceGroups;
};

const max = (a: number[]): number | undefined => {
  if (a.length === 0) {
    return undefined;
  }
  let maxValue = a[0];
  for (const x of a) {
    if (x > maxValue) {
      maxValue = x;
    }
  }
  return maxValue;
};
