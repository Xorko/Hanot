import type * as InkML from '../core/inkml';
import * as Trace from '../core/trace';
import * as Word from '../core/word';

/**
 * Get points used for SVG from an InkML
 *
 * @param content The content of the InkML
 */
export const getPointsFromInkML = (content: InkML.Type) => {
  return content.words.map(word => getPointFromWord(word)).flat();
};

export const getPointFromWord = (word: Word.Type) => {
  const defaultTraceGroups = word.defaultTraceGroup;
  const traceGroups = word.tracegroups.map(traceGroup => traceGroup.traces);
  const traces = defaultTraceGroups.concat(...traceGroups);

  return getPointsFromTraces(traces);
};

export const getPointsFromTraces = (traces: Trace.Type[]) => {
  return traces.map(getPointsFromTrace).flat();
};

export const getPointsFromTrace = (trace: Trace.Type) => {
  return trace.dots.map(({ x, y }) => ({ x, y }));
};
