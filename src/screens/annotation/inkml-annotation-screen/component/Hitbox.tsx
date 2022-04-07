import React from 'react';
import {Circle} from 'react-native-svg';
import * as Dot from '../core/dot';

interface HitBoxProps {
  dot: Dot.Type; // the dot to associate to the hitbox
  dimensions: {factorSize: number; posHorizontal: number; posVertical: number};
  handlePressHitBox: (indexOfTrace: number) => void;
  indexOfTrace: number;
}

export const Hitbox = ({
  dot,
  indexOfTrace,
  handlePressHitBox,
  dimensions,
}: HitBoxProps) => {
  return (
    <Circle // ajoute un élément cliquable sur chaque point du tracé
      onPress={() => handlePressHitBox(indexOfTrace)}
      cx={dot.x * dimensions.factorSize + dimensions.posHorizontal}
      cy={dot.y * dimensions.factorSize + dimensions.posVertical}
      r={5}
      fill={'red'}
    />
  );
};
