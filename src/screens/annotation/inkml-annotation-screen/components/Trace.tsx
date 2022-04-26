import { GestureResponderEvent } from 'react-native';
import { Polyline } from 'react-native-svg';
import * as TraceData from '../../../../core/trace';

interface TraceProps {
  // The traces to draw on the SVG
  parsedDots: TraceData.Type[];
  dimensions: {
    factorSize: number;
    posHorizontal: number;
    posVertical: number;
  };
  annotated: boolean;
  handlePress: (e: any, idxTrac: number) => void;
  editLetterTraces: (traces: TraceData.Type[]) => void;
}

const Trace = ({
  parsedDots,
  annotated,
  handlePress,
  dimensions,
  editLetterTraces,
}: TraceProps) => {
  return (
    <>
      {parsedDots.map((trace, idxTrace) => (
        <Polyline
          fill="none"
          key={parsedDots.indexOf(trace)}
          points={trace.dots
            .map(
              ({ x, y }) =>
                `${x * dimensions.factorSize + dimensions.posHorizontal},${
                  y * dimensions.factorSize + dimensions.posVertical
                }`,
            )
            .join(' ')}
          strokeWidth="5"
          stroke={annotated ? 'green' : 'black'}
          onPress={(e: GestureResponderEvent) => {
            if (!annotated) {
              handlePress(e, idxTrace);
              editLetterTraces(parsedDots);
            }
          }}
          strokeLinejoin="round"
        />
      ))}
    </>
  );
};

export default Trace;
