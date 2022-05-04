import { useEffect, useState } from 'react';
import PolylineRenderer from '../../../../components/PolylineRenderer';
import * as Trace from '../../../../core/trace';
import * as TraceGroup from '../../../../core/tracegroup';
import { Size } from '../../../../types/coordinates-types';
import { Transform } from '../types/annotation-types';
import { getTransform } from '../utils/transform-utils';

type LetterPolylineProps = {
  containerSize: Size;
  trace: Trace.Type;
  tracegroup: TraceGroup.Type;
};

function LetterPolyline({
  containerSize,
  trace,
  tracegroup,
}: LetterPolylineProps) {
  const [transform, setTransform] = useState<Transform>();

  useEffect(() => {
    if (tracegroup.traces.length > 0) {
      const { width, height } = containerSize;

      const dots = tracegroup.traces
        .map(traceGroupTrace =>
          traceGroupTrace.dots.map(({ x, y }) => {
            return { x, y };
          }),
        )
        .flat();
      setTransform(getTransform(dots, { width, height }));
    }
  }, [tracegroup.traces, containerSize]);

  return (
    <>
      {transform && (
        <PolylineRenderer points={trace.dots} transform={transform} />
      )}
    </>
  );
}

export default LetterPolyline;
