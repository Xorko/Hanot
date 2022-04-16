import {View} from 'react-native';
import {Polyline} from 'react-native-svg';
import * as Trace from '../../../../core/trace';

interface WrittedLetterProps {
  // dimensions: { factorSize: number; posHorizontal: number; posVertical: number };
  traces: Trace.Type[];
  index: number;
}

// const dimensions : Dimension;

export const WrittedLetter = ({traces}: WrittedLetterProps) => {
  return (
    <View>
      {traces.map(trace => (
        <Polyline // each PolyLine draws a trace
          key={traces.indexOf(trace)}
          points={trace.dots.map(({x, y}) => `${x + 250},${y}`).join(' ')}
          strokeWidth="4"
          stroke="black"
        />
      ))}
    </View>
  );
};
