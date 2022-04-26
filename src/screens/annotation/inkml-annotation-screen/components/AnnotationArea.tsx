import cloneDeep from 'lodash/cloneDeep';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import Svg from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import * as TraceData from '../../../../core/trace';
import * as TraceGroup from '../../../../core/tracegroup';
import * as Word from '../../../../core/word';
import { RootState } from '../../../../stores/store';
import { pushDots, setDefaultTraceGroup } from '../current-word-slice';
import { Dimension } from '../types/annotation-types';
import { Hitbox } from './Hitbox';
import { Trace } from './Trace';

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
      const ycoords = currentWord.defaultTraceGroup //TODO A changer, ne va pas marcher pour un mot dont l'annotation est commence
        .map(trace => trace.dots.map(({ y }) => y))
        .flat();
      currentWord.tracegroups.map(tracegroup => {
        tracegroup.traces.map(trace =>
          trace.dots.map(({ y }) => ycoords.push(y)),
        );
      });
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

  const handlePress = (e: any, idxTrace: number) => {
    if (currentWord !== undefined && dimensions !== undefined) {
      // setting finalTraceGroups
      const traceGroups = currentWord.tracegroups;
      if (traceGroups.length === 0) {
        console.error('AnnotationArea : error box empty');
      } else {
        const point =
          Platform.OS === 'web'
            ? { x: e.nativeEvent.layerX, y: e.nativeEvent.layerY }
            : { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY };

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
        dispatch(pushDots({ leftTrace, idxTrace }));

        // setting state for rerender
        setFinalTraceGroups(traceGroups);

        // setting defaultTraces
        currentDefaultTraces[idxTrace].dots = rightTrace;

        dispatch(setDefaultTraceGroup(currentDefaultTraces));
      }
    } else {
      throw new Error('AnnotationArea: handlePress -- currentWord undefined');
    }
  };

  const handlePressHitBox = (idxTrace: number) => {
    if (currentWord !== undefined) {
      // setting finalTraceGroups
      const traceGroups = currentWord.tracegroups;

      if (traceGroups.length === 0) {
        console.error('AnnotationArea: handlePressHitBox --  error box empty');
      } else {
        const defaultTracesCopy = cloneDeep(defaultTraces);
        const leftTrace = [...defaultTracesCopy[idxTrace].dots];
        defaultTracesCopy[idxTrace].dots = [];

        dispatch(pushDots({ leftTrace, idxTrace }));

        //setting state for rerender
        setFinalTraceGroups(traceGroups);

        //setting defaultTraces
        dispatch(setDefaultTraceGroup(defaultTracesCopy));
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
          {finalTraceGroups.map((tracegroup, idx) => (
            <Trace
              key={idx}
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
                  key={idx}
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
