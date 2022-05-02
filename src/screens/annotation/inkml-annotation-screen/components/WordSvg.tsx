import cloneDeep from 'lodash/cloneDeep';
import { useEffect, useState } from 'react';
import { GestureResponderEvent, Platform } from 'react-native';
import PolylineRenderer from '../../../../components/PolylineRenderer';
import * as Trace from '../../../../core/trace';
import * as TraceGroup from '../../../../core/tracegroup';
import { useAppDispatch, useAppSelector } from '../../../../stores/hooks';
import colors from '../../../../style/colors';
import { useSelectedBox } from '../../context/SelectedBoxContext';
import { usePolylineTransformContext } from '../context/PolylineTransformContext';
import {
  pushDots,
  pushTraceGroup,
  setDefaultTraceGroup,
} from '../current-word-slice';
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

  const { selectedBox, setSelectedBox } = useSelectedBox();

  const [defaultTraces, setDefaultTraces] = useState<Trace.Type[]>([]);

  const [annotatedTraceGroups, setAnnotatedTraceGroups] = useState<
    TraceGroup.Type[]
  >([]);

  const handlePress = (e: any, idx: number) => {
    if (currentWord) {
      const traceGroups = currentWord.tracegroups;

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
      let idxTraceGroup;

      if (selectedBox === undefined) {
        idxTraceGroup = traceGroups.length;

        // Add a new traceGroup when clicking on the trace
        dispatch(pushTraceGroup());

        // Adding all traces drawn before to the traceGroup
        for (let i = 0; i < idx; i++) {
          if (currentDefaultTraces[i].dots.length > 0) {
            const traceToAdd = [...currentDefaultTraces[i].dots];
            dispatch(
              pushDots({
                leftTrace: traceToAdd,
                idxOldTrace: i,
                idxTraceGroup: idxTraceGroup,
              }),
            );
            currentDefaultTraces[i].dots = [];
          }
        }
      } else {
        idxTraceGroup = selectedBox;
      }

      // Adding the dots to the left of the trace clicked to the traceGroup
      const rightTrace = currentDefaultTraces[idx].dots.splice(index);
      const leftTrace = currentDefaultTraces[idx].dots;

      dispatch(
        pushDots({
          leftTrace,
          idxOldTrace: idx,
          idxTraceGroup: idxTraceGroup,
        }),
      );

      // setting defaultTraces
      currentDefaultTraces[idx].dots = rightTrace;

      dispatch(setDefaultTraceGroup(currentDefaultTraces));

      // setting state for rerender
      setAnnotatedTraceGroups(traceGroups);

      setSelectedBox(undefined);
    }
  };

  const handlePointPress = (traceIndex: number) => {
    if (currentWord) {
      const traceGroups = currentWord.tracegroups;
      const defaultTracesCopy = cloneDeep(defaultTraces);

      let idxTraceGroup;

      if (selectedBox === undefined) {
        idxTraceGroup = traceGroups.length;

        // Add a new traceGroup when clicking on the trace
        dispatch(pushTraceGroup());

        // Adding all traces drawn before to the traceGroup
        for (let i = 0; i < traceIndex; i++) {
          if (defaultTracesCopy[i].dots.length > 0) {
            const traceToAdd = [...defaultTracesCopy[i].dots];
            dispatch(
              pushDots({
                leftTrace: traceToAdd,
                idxOldTrace: i,
                idxTraceGroup: idxTraceGroup,
              }),
            );
            defaultTracesCopy[i].dots = [];
          }
        }
      } else {
        idxTraceGroup = selectedBox;
      }

      const leftTrace = [...defaultTracesCopy[traceIndex].dots];
      defaultTracesCopy[traceIndex].dots = [];

      dispatch(
        pushDots({
          leftTrace,
          idxOldTrace: traceIndex,
          idxTraceGroup: idxTraceGroup,
        }),
      );

      //setting state for rerender
      setAnnotatedTraceGroups(traceGroups);

      //setting defaultTraces
      dispatch(setDefaultTraceGroup(defaultTracesCopy));

      setSelectedBox(undefined);
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
