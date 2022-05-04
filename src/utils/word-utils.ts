import type * as InkML from '../core/inkml';
import * as Trace from '../core/trace';

/**
 * Get points used for SVG from an InkML
 *
 * @param content The content of the InkML
 */
export const getPointsFromInkML = (content: InkML.Type) => {
  // TODO: Adapt this to support multiple words in a single file

  const defaultTraceGroups = content.words[0].defaultTraceGroup;
  const traceGroups = content.words[0].tracegroups.map(
    traceGroup => traceGroup.traces,
  );
  const traces = defaultTraceGroups.concat(...traceGroups);

  return getPointsFromTraces(traces);
};

export const getPointsFromTraces = (traces: Trace.Type[]) => {
  return traces.map(getPointsFromTrace).flat();
};

export const getPointsFromTrace = (trace: Trace.Type) => {
  return trace.dots.map(({ x, y }) => ({ x, y }));
};
