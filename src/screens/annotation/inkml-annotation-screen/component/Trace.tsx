import React from 'react';
import {GestureResponderEvent, View} from 'react-native';
import {Polyline} from 'react-native-svg';
import * as TraceData from '../core/trace';

interface TraceProps {
  parsedDots: TraceData.Type[]; // the traces to draw on the SVG
  dimensions: {factorSize: number; posHorizontal: number; posVertical: number};
  annotated: boolean;
  handlePress: (e: GestureResponderEvent, idxTrac: number) => void;
  editLetterTraces: (traces: TraceData.Type[]) => void;
}

export const Trace = ({
  parsedDots,
  annotated,
  handlePress,
  dimensions,
  editLetterTraces,
}: TraceProps) => {
  return (
    <View>
      {parsedDots.map((trace, idxTrace) => (
        <Polyline // each PolyLine draws a trace
          key={parsedDots.indexOf(trace)}
          points={trace.dots
            .map(
              ({x, y}) =>
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
    </View>
  );
};
