import React from 'react';
import { Circle } from 'react-native-svg';
import * as Dot from '../../../../core/dot';
import * as Trace from '../../../../core/trace';

interface HitBoxProps {
  // the dot to associate to the hitbox
  dot: Dot.Type;
  dimensions: {
    factorSize: number;
    posHorizontal: number;
    posVertical: number;
  };
  handlePressHitBox: (indexOfTrace: number) => void;
  indexOfTrace: number;
  editLetterTraces: (traces: Trace.Type[]) => void;
}
export const Hitbox = ({
  dot,
  indexOfTrace,
  handlePressHitBox,
  dimensions,
  editLetterTraces,
}: HitBoxProps) => {
  return (
    <Circle
      onPress={() => {
        handlePressHitBox(indexOfTrace);
        editLetterTraces([]);
      }}
      cx={dot.x * dimensions.factorSize + dimensions.posHorizontal}
      cy={dot.y * dimensions.factorSize + dimensions.posVertical}
      r={5}
      fill={'red'}
    />
  );
};
