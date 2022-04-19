import { RootState } from 'app/store';
import React, { useEffect, useState } from 'react';
import { GestureResponderEvent, View } from 'react-native';
import Svg from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import * as TraceData from '../../../../core/trace';
import * as TraceGroup from '../../../../core/tracegroup';
import * as Word from '../../../../core/word';
import { pushDotsToRight, pushTraceToRight } from '../currentWordSlice';
import { Dimension } from '../types/annotation-types';
import { Hitbox } from './Hitbox';
import { Trace } from './Trace';
const cloneDeep = require('clone-deep');

interface AnnotationAreaProps {
  editLetterTraces: (traces: TraceData.Type[]) => void;
  sizeComponent: { width: number; height: number };
}
export const AnnotationArea = ({
  editLetterTraces,
  sizeComponent,
}: AnnotationAreaProps) => {
  const [finalTraceGroups, setFinalTraceGroups] = useState<TraceGroup.Type[]>(
    [],
  );
  const [defaultTraces, setDefaultTraces] = useState<TraceData.Type[]>([]);
  const [dimensions, setDimensions] = useState<Dimension>();
  // const { currentWord } = useContext(TraceContext);
  var currentWord: Word.Type = useSelector(
    (state: RootState) => state.currentWord,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setFinalTraceGroups(currentWord ? currentWord.tracegroups : []);
    setDefaultTraces(currentWord ? currentWord.defaultTraceGroup : []);
    if (currentWord) {
      const xcoords = currentWord.defaultTraceGroup
        .map(trace => trace.dots.map(({ x }) => x))
        .flat();
      currentWord.tracegroups.map(tracegroup => {
        tracegroup.traces.map(trace =>
          trace.dots.map(({ x }) => xcoords.push(x)),
        );
      });
      const ycoords = currentWord.defaultTraceGroup //A changer, ne va pas marcher pour un mot dont l'annotation est commence
        .map(trace => trace.dots.map(({ y }) => y))
        .flat();
      const lengthWord = getMaxXValue(xcoords) - getMinXValue(xcoords);
      const heightWord = getMaxXValue(ycoords) - getMinXValue(ycoords);
      setDimensions({
        factorSize: responsiveWord(lengthWord, sizeComponent.width),
        posHorizontal:
          -getMinXValue(xcoords) + (sizeComponent.width - lengthWord) / 2 + 20,
        posVertical:
          -getMinXValue(ycoords) + (sizeComponent.height - heightWord) / 2 - 40,
      });
    }
  }, [currentWord, sizeComponent]);

  const distance = (
    pointA: { x: number; y: number },
    pointB: { x: number; y: number },
  ) => {
    return Math.sqrt(
      Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2),
    );
  };

  const handlePress = (e: GestureResponderEvent, idxTrace: number) => {
    if (currentWord !== undefined && dimensions !== undefined) {
      // setting finalTraceGroups
      const traceGroups = currentWord.tracegroups;
      if (traceGroups.length === 0) {
        // //A changer pour l'ajout d'un tracegroup quand on clique pour ajouter une box --> erreur pas de traceGroup (ie pas de box ajoute)
        // finalTraceGroupsCopy.push({
        //   traces: [{dots: leftTrace}],
        //   label: pendingChar,
        // });
        console.error('AnnotationArea : error box empty');
      } else {
        const point = {
          x: e.nativeEvent.locationX,
          y: e.nativeEvent.locationY,
        };
        const realPoint = {
          x: (point.x - dimensions.posHorizontal) / dimensions.factorSize,
          y: (point.y - dimensions.posVertical) / dimensions.factorSize,
        };
        const closest = defaultTraces[idxTrace].dots.reduce((a, b) =>
          distance(realPoint, a) < distance(realPoint, b) ? a : b,
        );
        const index = defaultTraces[idxTrace].dots.findIndex(
          dot => dot.x === closest.x && dot.y === closest.y,
        );

        const currentDefaultTraces = cloneDeep(defaultTraces);
        const rightTrace = currentDefaultTraces[idxTrace].dots.splice(index);
        const leftTrace = currentDefaultTraces[idxTrace].dots;

        // traceGroups[traceGroups.length - 1].traces.push({
        //   dots: leftTrace,
        // });
        dispatch(pushDotsToRight(leftTrace));

        // setting state for rerender
        setFinalTraceGroups(traceGroups);

        // setting defaultTraces
        currentDefaultTraces[idxTrace].dots = rightTrace;

        setDefaultTraces(currentDefaultTraces);
      }
    } else {
      throw new Error('AnnotationArea: handlePress -- currentWord undefined');
    }
  };

  const handlePressHitBox = (indexOfTrace: number) => {
    if (currentWord !== undefined) {
      // setting finalTraceGroups
      const traceGroups = currentWord.tracegroups;

      if (traceGroups.length === 0) {
        // //A changer pour l'ajout d'un tracegroup quand on clique pour ajouter une box --> erreur pas de traceGroup (ie pas de box ajoute)
        // finalTraceGroupsCopy.push({
        //   traces: [traceToMove[0]],
        //   label: pendingChar,
        // });
        console.log('AnnotationArea : error box empty');
      } else {
        const defaultTracesCopy = [...defaultTraces];
        const traceToMove = defaultTracesCopy.splice(indexOfTrace, 1);
        // traceGroups[traceGroups.length - 1].traces.push(traceToMove[0]);
        dispatch(pushTraceToRight(traceToMove));

        //setting state for rerender
        setFinalTraceGroups(traceGroups);

        //setting defaultTraces
        setDefaultTraces(defaultTracesCopy);
      }
    } else {
      throw new Error('AnnotationArea: handlePress -- currentWord undefined');
    }
  };

  return (
    <View>
      {dimensions !== undefined && (
        <Svg width="900" height="900">
          <Trace
            parsedDots={defaultTraces}
            annotated={false}
            handlePress={handlePress}
            dimensions={dimensions}
            editLetterTraces={editLetterTraces}
          />
          {finalTraceGroups.map(tracegroup => (
            <Trace
              parsedDots={tracegroup.traces}
              annotated={true}
              handlePress={handlePress}
              dimensions={dimensions}
              editLetterTraces={editLetterTraces}
            />
          ))}
          {defaultTraces.map((trace, idx) => {
            if (trace.dots.length > 0) {
              return (
                <Hitbox
                  dot={trace.dots[trace.dots.length - 1]}
                  dimensions={dimensions}
                  handlePressHitBox={handlePressHitBox}
                  indexOfTrace={idx}
                  editLetterTraces={editLetterTraces}
                />
              );
            }
          })}
        </Svg>
      )}
    </View>
  );
};

/**
 * Compute the value used for resizing the word
 * @param wordSize
 * @returns value to multiply coordinates of dots
 */
const responsiveWord = (wordSize: number, widthComp: number) => {
  // return width / (2.1 * wordSize);
  return widthComp / wordSize / 1.4;
};

/**
 * @param xcoords list of x points
 * @returns max x value
 */
const getMaxXValue = (xcoords: number[]) => {
  return Math.max.apply(null, xcoords);
};

/**
 * @param xcoords list of x points
 * @returns min x value
 */
const getMinXValue = (xcoords: number[]) => {
  return Math.min.apply(null, xcoords);
};
