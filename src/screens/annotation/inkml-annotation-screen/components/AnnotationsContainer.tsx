import { cloneDeep } from 'lodash';
import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import SvgContainer from '../../../../components/SvgContainer';
import { createEmptyTraceGroup } from '../../../../core/input';
import * as TraceGroup from '../../../../core/tracegroup';
import { useAppDispatch, useAppSelector } from '../../../../stores/hooks';
import Annotation from '../../components/Annotation';
import Annotations from '../../components/Annotations';
import { useSelectedBox } from '../../context/SelectedBoxContext';
import { Size } from '../../types/coordinates-types';
import {
  deleteTraceGroups,
  initWord,
  setFinalTraceGroups,
} from '../current-word-slice';
import LetterPolyline from './LetterPolyline';

function AnnotationsContainer() {
  const dispatch = useAppDispatch();
  const currentWord = useAppSelector(state => state.currentWord);

  const { selectedBox, setSelectedBox } = useSelectedBox();

  const [containerSize, setContainerSize] = useState<Size>();

  // TODO: remove when changing the annotation
  const handleAddBox = () => {
    if (currentWord) {
      const wordCopy = cloneDeep(currentWord);
      wordCopy.tracegroups.push(createEmptyTraceGroup());
      dispatch(initWord(wordCopy));
    }
  };

  const getContainerSize = (event: LayoutChangeEvent) => {
    setContainerSize(event.nativeEvent.layout);
  };

  const selectBox = (idx: number) => {
    if (selectedBox === idx) {
      setSelectedBox(undefined);
    } else {
      setSelectedBox(idx);
    }
  };

  const deleteBox = () => {
    if (currentWord && selectedBox !== undefined) {
      const finalTraceGroups: TraceGroup.Type[] = cloneDeep(
        currentWord.tracegroups,
      );

      const deletedTraceGroups: TraceGroup.Type[] = finalTraceGroups
        .splice(selectedBox)
        .reverse();

      dispatch(deleteTraceGroups(deletedTraceGroups));

      dispatch(setFinalTraceGroups(finalTraceGroups));
      setSelectedBox(undefined);
    }
  };

  return (
    <Annotations
      type="inkml"
      onAddDiacritic={handleAddBox}
      onDeleteAnnotation={deleteBox}>
      {currentWord?.tracegroups.map((tracegroup, index) => (
        <Annotation
          key={index}
          onPress={() => selectBox(index)}
          selected={index === selectedBox}>
          <View style={styles.polylineContainer} onLayout={getContainerSize}>
            <SvgContainer>
              {containerSize &&
                tracegroup.traces.map((trace, idx) => (
                  <LetterPolyline
                    key={idx}
                    tracegroup={tracegroup}
                    trace={trace}
                    containerSize={containerSize}
                  />
                ))}
            </SvgContainer>
          </View>
        </Annotation>
      ))}
    </Annotations>
  );
}

const styles = StyleSheet.create({
  polylineContainer: {
    flex: 1,
  },
});

export default AnnotationsContainer;
