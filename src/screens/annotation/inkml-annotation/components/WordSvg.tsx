import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import { useEffect, useState } from 'react';
import { GestureResponderEvent, Platform } from 'react-native';
import PolylineRenderer from '../../../../components/PolylineRenderer';
import * as Char from '../../../../core/char';
import * as Dot from '../../../../core/dot';
import * as Trace from '../../../../core/trace';
import * as TraceGroup from '../../../../core/tracegroup';
import { useAppDispatch, useAppSelector } from '../../../../stores/hooks';
import colors from '../../../../style/colors';
import { useScrollViewRef } from '../../context/ScrollViewRefContext';
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
  const { scrollViewRef } = useScrollViewRef();

  /**
   * Scroll to the end of the annotations scrollview
   *
   * It needs to be debounced because of Redux
   */
  const debouncedScrollToEnd = debounce(
    () => scrollViewRef?.current?.scrollToEnd({ animated: true }),
    100,
  );

  const annotatingAllPreviousTraces = (
    idx: number,
    traceGroups: TraceGroup.Type[],
    currentDefaultTraces: Trace.Type[],
  ) => {
    if (selectedBox === undefined) {
      // Add a new traceGroup when clicking on the trace
      dispatch(pushTraceGroup());

      // Adding all traces drawn before to the traceGroup
      for (let i = 0; i < idx; i++) {
        if (!currentDefaultTraces[i]) {
          currentDefaultTraces[i] = {
            dots: [],
            oldTrace: -1,
          };
        }

        if (
          currentDefaultTraces[i] &&
          currentDefaultTraces[i].dots.length > 0
        ) {
          const traceToAdd = [...currentDefaultTraces[i].dots];
          dispatch(
            pushDots({
              leftTrace: traceToAdd,
              idxOldTrace: i,
              idxTraceGroup: traceGroups.length,
            }),
          );
          currentDefaultTraces[i].dots = [];
        }
      }

      debouncedScrollToEnd();
      return traceGroups.length;
    } else {
      return selectedBox;
    }
  };

  const dispatchingData = (
    oldTrace: number,
    idxTraceGroup: number,
    leftTrace: Dot.Type[],
    rightTrace: Dot.Type[],
    traceGroups: TraceGroup.Type[],
    currentDefaultTraces: Trace.Type[],
  ) => {
    dispatch(
      pushDots({
        leftTrace,
        idxOldTrace: oldTrace,
        idxTraceGroup: idxTraceGroup,
      }),
    );

    currentDefaultTraces[oldTrace].dots = rightTrace;

    dispatch(setDefaultTraceGroup(currentDefaultTraces));
    setAnnotatedTraceGroups(traceGroups);
    setSelectedBox(undefined);
  };

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
      let idxTraceGroup = annotatingAllPreviousTraces(
        idx,
        traceGroups,
        currentDefaultTraces,
      );

      // Adding the dots to the left of the trace clicked to the traceGroup
      const rightTrace = currentDefaultTraces[idx].dots.splice(index);
      const leftTrace = currentDefaultTraces[idx].dots;

      dispatchingData(
        idx,
        idxTraceGroup,
        leftTrace,
        rightTrace,
        traceGroups,
        currentDefaultTraces,
      );
    }
  };

  const handlePointPress = (traceIndex: number) => {
    if (currentWord) {
      const traceGroups = currentWord.tracegroups;
      const defaultTracesCopy = cloneDeep(defaultTraces);

      let idxTraceGroup = annotatingAllPreviousTraces(
        traceIndex,
        traceGroups,
        defaultTracesCopy,
      );

      const leftTrace = [...defaultTracesCopy[traceIndex].dots];
      defaultTracesCopy[traceIndex].dots = [];

      dispatchingData(
        traceIndex,
        idxTraceGroup,
        leftTrace,
        [],
        traceGroups,
        defaultTracesCopy,
      );
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
        traceGroup.traces.map((trace, idx) =>
          Char.isNoise(traceGroup.label) ? (
            <PolylineRenderer
              key={idx}
              points={trace.dots}
              strokeColor={colors.warning}
              transform={transform}
            />
          ) : (
            <PolylineRenderer
              key={idx}
              points={trace.dots}
              strokeColor={colors.success}
              transform={transform}
            />
          ),
        ),
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
