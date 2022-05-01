import cloneDeep from 'lodash/cloneDeep';
import { useEffect, useState } from 'react';
import { GestureResponderEvent, Platform } from 'react-native';
import PolylineRenderer from '../../../../components/PolylineRenderer';
import * as Trace from '../../../../core/trace';
import * as TraceGroup from '../../../../core/tracegroup';
import { useAppDispatch, useAppSelector } from '../../../../stores/hooks';
import colors from '../../../../style/colors';
import { usePolylineTransformContext } from '../context/PolylineTransformContext';
import { pushDots, setDefaultTraceGroup } from '../current-word-slice';
import { distance } from '../utils/math-utils';
import { reverseTransform } from '../utils/transform-utils';
import SplitPoint from './SplitPoint';

type WordSvgProps = {
  traces: Trace.Type[];
  annotated?: boolean;
  onPress?: (e: GestureResponderEvent, idx: number) => void;
};

function WordSvg({ traces }: WordSvgProps) {
  const currentWord = useAppSelector(state => state.currentWord);
  const dispatch = useAppDispatch();

  const { transform } = usePolylineTransformContext();

  const [defaultTraces, setDefaultTraces] = useState<Trace.Type[]>([]);

  const [annotatedTraceGroups, setAnnotatedTraceGroups] = useState<
    TraceGroup.Type[]
  >([]);

  const handlePress = (e: any, idx: number) => {
    if (currentWord) {
      const traceGroups = currentWord.tracegroups;
      if (traceGroups.length === 0) {
        console.error('AnnotationArea : error box empty');
      } else {
        const pressPosition =
          Platform.OS === 'web'
            ? { x: e.nativeEvent.layerX, y: e.nativeEvent.layerY }
            : { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY };

        const point = reverseTransform(pressPosition, transform);

        const closest = defaultTraces[idx].dots.reduce((a, b) =>
          distance(point, a) < distance(point, b) ? a : b,
        );

        const index = defaultTraces[idx].dots.findIndex(
          dot => dot.x === closest.x && dot.y === closest.y,
        );

        const currentDefaultTraces = cloneDeep(defaultTraces);
        const rightTrace = currentDefaultTraces[idx].dots.splice(index);
        const leftTrace = currentDefaultTraces[idx].dots;

        dispatch(pushDots({ leftTrace, idxTrace: idx }));

        // setting state for rerender
        setAnnotatedTraceGroups(traceGroups);

        // setting defaultTraces
        currentDefaultTraces[idx].dots = rightTrace;

        dispatch(setDefaultTraceGroup(currentDefaultTraces));

        setAnnotatedTraceGroups(traceGroups);
      }
    }
  };

  const handlePointPress = (traceIndex: number) => {
    if (currentWord !== undefined) {
      const traceGroups = currentWord.tracegroups;

      if (traceGroups.length === 0) {
        console.error('AnnotationArea: handlePressHitBox --  error box empty');
      } else {
        const defaultTracesCopy = cloneDeep(defaultTraces);
        const leftTrace = [...defaultTracesCopy[traceIndex].dots];
        defaultTracesCopy[traceIndex].dots = [];

        dispatch(pushDots({ leftTrace, idxTrace: traceIndex }));

        //setting state for rerender
        setAnnotatedTraceGroups(traceGroups);

        //setting defaultTraces
        dispatch(setDefaultTraceGroup(defaultTracesCopy));
      }
    } else {
      throw new Error('AnnotationArea: handlePress -- currentWord undefined');
    }
  };

  useEffect(() => {
    setDefaultTraces(currentWord ? currentWord.defaultTraceGroup : []);
    setAnnotatedTraceGroups(currentWord ? currentWord.tracegroups : []);
  }, [currentWord]);

  return (
    <>
      {traces.map((trace, idx) => (
        <PolylineRenderer
          key={idx}
          points={trace.dots}
          onPress={(e: any) => handlePress(e, idx)}
          strokeColor={colors.dark}
          transform={transform}
        />
      ))}
      {annotatedTraceGroups.map(traceGroup =>
        traceGroup.traces.map((trace, idx) => (
          <PolylineRenderer
            key={idx}
            points={trace.dots}
            onPress={() => {}}
            strokeColor={colors.success}
            transform={transform}
          />
        )),
      )}
      {defaultTraces.map((trace, idx) => {
        if (trace.dots.length > 0) {
          return (
            <SplitPoint
              key={idx}
              dot={trace.dots[trace.dots.length - 1]}
              onPress={() => handlePointPress(idx)}
            />
          );
        }
      })}
    </>
  );
}

export default WordSvg;
