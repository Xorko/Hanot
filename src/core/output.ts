import { AnnotatedInkml } from '../types/annotated-files-types';
import { SerializableMap } from '../types/core-types';
import * as Char from './char';
import * as Data from './data';
import { TraceData } from './data';
import * as InkML from './inkml';
import * as Trace from './trace';
import * as Word from './word';

/**
 *
 * @param annotatedInkML the annotated InkML to be converted.
 * @returns A Data structure (the main structure of the InkML)
 */
export const exportInkML = (
  annotatedInkML: AnnotatedInkml,
): Data.Type | undefined => {
  const exportedInk = exportInk(annotatedInkML.content);

  if (exportedInk) {
    return {
      ['?xml']: annotatedInkML['?xml'],
      ink: exportedInk,
    };
  }
};
/**
 * Generates a InkData object that is a structure used to export InkML
 * @param ink the InkML structure to be converted.
 * @returns A InkData structure
 */
export const exportInk = (ink?: InkML.Type): Data.InkData | undefined => {
  if (ink !== undefined) {
    const t = ink.words.map(exportWord);
    let r: Data.TraceGroupData | Data.TraceGroupData[];
    let an: Data.AnnoData[] | undefined;

    if (t.length === 0) {
      throw new Error('exportInk Error: no trace group');
    } else if (t.length === 1) {
      r = t[0] as Data.TraceGroupData;

      an = r.annotation;
      delete r.annotation;
    } else {
      r = t as Data.TraceGroupData[];
    }
    const i: Data.InkData = {
      attr: { xmlns: 'http://www.w3.org/2003/InkML' },
      traceFormat: {
        channel: [
          { attr: { name: Data.Chan.X, type: 'decimal' as const } },
          { attr: { name: Data.Chan.Y, type: 'decimal' as const } },
          { attr: { name: Data.Chan.F, type: 'decimal' as const } },
          { attr: { name: Data.Chan.T, type: 'integer' as const } },
        ],
      },
      annotation: an,
      traceGroup: r,
    };
    if (an === undefined) {
      delete i.annotation;
    }
    return i;
  } else {
    return undefined;
  }
};

const buildTraces = (traces: Trace.Type[]): (string | TraceData)[] => {
  return traces.map(e =>
    e.oldTrace > -1
      ? {
          attr: { oldTrace: '' + e.oldTrace },
          '#text': e.dots.map(d => `${d.x} ${d.y} ${d.f} ${d.t}`).join(' ,'),
        }
      : e.dots.map(d => `${d.x} ${d.y} ${d.f} ${d.t}`).join(' ,'),
  );
};

const exportWord = (tg: Word.Type): Data.TraceGroupData => {
  const uncommented = [
    ...tg.tracegroups
      .filter(a => Char.isPending(a.label))
      .flatMap(e => e.traces),
    ...tg.defaultTraceGroup.filter(a => a.dots.length > 0),
  ].sort((a, b) => {
    if (a.dots.length !== 0 && b.dots.length !== 0) {
      if (a.dots[0].t < b.dots[0].t) {
        return -1;
      }
      if (a.dots[0].t > b.dots[0].t) {
        return 1;
      }
    }
    return 0;
  });

  const traces: Data.TraceGroupData[] = tg.tracegroups
    .filter(a => Char.isLetter(a.label) || Char.isNoise(a.label))
    .map((a, i) => {
      const tx: (string | TraceData)[] = buildTraces(a.traces);
      let r: Data.TraceGroupData = {};
      if (tx.length === 0) {
        throw new Error('exportTraceGroup Error: empty trace group, no trace');
      } else if (tx.length === 1) {
        r = {
          attr: {
            'xml:id': Char.getChar(a.label),
            positionInGroundTruthValue: i,
            noise: Char.isNoise(a.label) ? 'noise' : undefined,
          },
          trace: tx[0],
        };
        if (r.attr?.noise === undefined) {
          delete r.attr?.noise;
        }
        if (r.attr?.positionInGroundTruthValue === undefined) {
          delete r.attr?.positionInGroundTruthValue;
        }
        if (
          r.attr?.['xml:id'] === undefined ||
          r.attr?.['xml:id'] === '#noise'
        ) {
          delete r.attr?.['xml:id'];
        }
        if (
          r.attr !== undefined &&
          Object.values(r.attr).every(item => item === undefined)
        ) {
          delete r.attr;
        }
        return r;
      } else {
        r = {
          attr: {
            'xml:id': Char.getChar(a.label),
            noise: Char.isNoise(a.label) ? 'noise' : undefined,
            positionInGroundTruthValue: i,
          },
          trace: tx,
        };
        if (r.attr?.noise === undefined) {
          delete r.attr?.noise;
        }
        if (r.attr?.positionInGroundTruthValue === undefined) {
          delete r.attr?.positionInGroundTruthValue;
        }
        if (
          r.attr?.['xml:id'] === undefined ||
          r.attr?.['xml:id'] === '#noise'
        ) {
          delete r.attr?.['xml:id'];
        }
        if (
          r.attr !== undefined &&
          Object.values(r.attr).every(item => item === undefined)
        ) {
          delete r.attr;
        }
        return r;
      }
    })
    .sort((a, b) => {
      const ax = a.attr?.positionInGroundTruthValue ?? -1;
      const bx = b.attr?.positionInGroundTruthValue ?? -1;
      if (ax < bx) {
        return -1;
      }
      if (ax > bx) {
        return 1;
      }
      return 0;
    });
  const annotationXML: Data.AnnoData[] = [];
  const annotationAttr: Data.AnnoData[] = [];
  enqueueAnnotations(annotationXML, tg.annotationsXML?.values);
  enqueueAnnotations(annotationAttr, tg.annotations);
  const xmlid = tg.predicted;

  const annotationXMLAttr = {
    attr: {
      type: tg.annotationsXML?.type ?? '',
    },
    annotation: annotationXML,
  };

  const r: Data.TraceGroupData = {
    attr: {
      'xml:id': xmlid,
    },
    annotationXML: annotationXMLAttr,
    annotation: annotationAttr,
    traceGroup: traces,
    trace: buildTraces(uncommented),
  };

  Object.entries(tg.attributes).forEach(
    ([key, value]) => (r.attr![key] = value),
  );

  if (annotationXML.length === 0 || annotationXMLAttr.attr.type === '') {
    delete r.annotationXML;
  }
  if (annotationAttr.length === 0) {
    delete r.annotation;
  }

  return r;
};

const enqueueAnnotations = (
  an: Data.AnnoData[],
  dict?: SerializableMap<string>,
) => {
  if (dict) {
    Object.entries(dict).forEach(([key, val]) => {
      an.push({
        '#text': val,
        attr: { type: key },
      });
    });
  }
};
