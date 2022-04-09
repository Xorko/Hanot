import React, {useContext, useEffect, useState} from 'react';
import {Dimensions, GestureResponderEvent, View} from 'react-native';
import Svg from 'react-native-svg';
import {TraceContext} from '../context/TraceContext';
import * as TraceData from '../../../../core/trace';
import * as TraceGroup from '../../../../core/tracegroup';
import {Hitbox} from './Hitbox';
import {Trace} from './Trace';

const {width} = Dimensions.get('window');

interface AnnotationAreaProps {
  editLetterTraces: (traces: TraceData.Type[]) => void;
}

export interface Dimension {
  factorSize: number;
  posHorizontal: number;
  posVertical: number;
}

export const AnnotationArea = ({editLetterTraces}: AnnotationAreaProps) => {
  const [finalTraceGroups, setFinalTraceGroups] = useState<TraceGroup.Type[]>(
    [],
  );
  const [defaultTraces, setDefaultTraces] = useState<TraceData.Type[]>([]);
  const [dimensions, setDimensions] = useState<Dimension>();
  const {currentWord} = useContext(TraceContext);

  useEffect(() => {
    setFinalTraceGroups(currentWord ? currentWord.tracegroups : []);
    setDefaultTraces(currentWord ? currentWord.defaultTraceGroup : []);
    if (currentWord) {
      const xcoords = currentWord.defaultTraceGroup //A changer, ne va pas marcher pour un mot dont l'annotation est commence
        .map(trace => trace.dots.map(({x}) => x))
        .flat();
      const lengthWord = GetMaxXValue(xcoords) - GetMinXValue(xcoords);
      setDimensions({
        factorSize: ResponsiveWord(lengthWord),
        posHorizontal: width / 1.42 - lengthWord,
        posVertical: width / 27,
      });
    }
  }, [currentWord]);

  console.log(
    'dimensions : ' +
      dimensions?.factorSize +
      ' ' +
      dimensions?.posHorizontal +
      ' ' +
      dimensions?.posVertical,
  );

  const distance = (
    pointA: {x: number; y: number},
    pointB: {x: number; y: number},
  ) => {
    return Math.sqrt(
      Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2),
    );
  };

  const handlePress = (e: GestureResponderEvent, idxTrace: number) => {
    if (currentWord !== undefined && dimensions !== undefined) {
      //setting finalTraceGroups
      const traceGroups = currentWord.tracegroups;
      if (traceGroups.length === 0) {
        // //A changer pour l'ajout d'un tracegroup quand on clique pour ajouter une box --> erreur pas de traceGroup (ie pas de box ajoute)
        // finalTraceGroupsCopy.push({
        //   traces: [{dots: leftTrace}],
        //   label: pendingChar,
        // });
        console.error('AnnotationArea : error box empty');
      } else {
        const point = {x: e.nativeEvent.locationX, y: e.nativeEvent.locationY};
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

        const currentDefaultTraces = [...defaultTraces];
        const rightTrace = currentDefaultTraces[idxTrace].dots.splice(index);
        const leftTrace = currentDefaultTraces[idxTrace].dots;

        traceGroups[traceGroups.length - 1].traces.push({
          dots: leftTrace,
        });

        //setting state for rerender
        setFinalTraceGroups(traceGroups);

        //setting defaultTraces
        currentDefaultTraces[idxTrace].dots = rightTrace;
        setDefaultTraces(currentDefaultTraces);

        //editLetterTraces(traceGroups[traceGroups.length - 1].traces)

        console.log(currentWord.tracegroups[0].traces.length);
        console.log(currentWord.defaultTraceGroup[0].dots.length);
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
        traceGroups[traceGroups.length - 1].traces.push(traceToMove[0]);

        //setting state for rerender
        setFinalTraceGroups(traceGroups);

        //setting defaultTraces
        setDefaultTraces(defaultTracesCopy);

        console.log(currentWord.tracegroups[0].traces.length);
        console.log(currentWord.defaultTraceGroup[0].dots.length);
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
          {defaultTraces.map((trace, idx) => (
            <Hitbox
              dot={trace.dots[trace.dots.length - 1]}
              dimensions={dimensions}
              handlePressHitBox={handlePressHitBox}
              indexOfTrace={idx}
            />
          ))}
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
const ResponsiveWord = (wordSize: number) => {
  return width / (2.1 * wordSize);
};

/**
 * @param xcoords list of x points
 * @returns max x value
 */
const GetMaxXValue = (xcoords: number[]) => {
  return Math.max.apply(null, xcoords);
};

/**
 * @param xcoords list of x points
 * @returns min x value
 */
const GetMinXValue = (xcoords: number[]) => {
  return Math.min.apply(null, xcoords);
};
