import { GestureResponderEvent } from 'react-native';
import PolylineRenderer from '../../../../components/PolylineRenderer';
import * as Trace from '../../../../core/trace';
import colors from '../../../../style/colors';

type WordPolylineProps = {
  traces: Trace.Type[];
  annotated?: boolean;
  onPress?: (e: GestureResponderEvent, idx: number) => void;
  wordMinCoordinates: { minX: number; minY: number; scale: number };
};

function WordPolyline({
  traces,
  annotated = false,
  wordMinCoordinates,
}: WordPolylineProps) {
  return (
    <>
      {traces.map((trace, idx) => (
        <PolylineRenderer
          key={idx}
          points={trace.dots}
          onPress={() => {}}
          strokeColor={annotated ? colors.success : colors.dark}
          minCoordinates={wordMinCoordinates}
        />
      ))}
    </>
  );
}

export default WordPolyline;
