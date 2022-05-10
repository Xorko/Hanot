import { cloneDeep } from 'lodash';
import { useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, TextInput, View } from 'react-native';
import SvgContainer from '../../../../components/SvgContainer';
import { useFileType } from '../../../../context/FileTypeContext';
import * as Char from '../../../../core/char';
import * as TraceGroup from '../../../../core/tracegroup';
import { useAppDispatch, useAppSelector } from '../../../../stores/hooks';
import { Size } from '../../../../types/coordinates-types';
import AnnotationCard from '../../components/AnnotationCard';
import Annotations from '../../components/Annotations';
import { useSelectedBox } from '../../context/SelectedBoxContext';
import { setCurrentAnnotatedImageCropAnnotationAtIndex } from '../../image-annotation/current-annotated-image';
import {
  annotateTraceGroup,
  deleteTraceGroups,
  setFinalTraceGroups,
} from '../current-word-slice';
import LetterPolyline from './LetterPolyline';

function AnnotationsContainer() {
  const dispatch = useAppDispatch();
  const currentWord = useAppSelector(state => state.currentWord);
  const { fileType } = useFileType();
  const { selectedBox, setSelectedBox } = useSelectedBox();
  const [containerSize, setContainerSize] = useState<Size>();
  const inputRefs = useRef<TextInput[]>([]);

  const getContainerSize = (event: LayoutChangeEvent) => {
    setContainerSize(event.nativeEvent.layout);
  };

  const insertIntoInputRefs = (ref: TextInput, index: number) => {
    inputRefs.current[index] = ref;
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

      inputRefs.current.splice(0, selectedBox);
    }
  };

  const markAsNoise = () => {
    if (currentWord && selectedBox !== undefined) {
      const finalTraceGroups: TraceGroup.Type[] = cloneDeep(
        currentWord.tracegroups,
      );

      finalTraceGroups[selectedBox].label = Char.noise;

      dispatch(setFinalTraceGroups(finalTraceGroups));
      setSelectedBox(undefined);
    }
  };

  /**
   * Modify the annotation of the traceGroup indicated by index
   * @param annotation the character captured from the keyboard
   * @param index the number corresponding to the traceGroup index in the currentWord
   */
  const editAnnotationLabel = (annotation: string, index: number): void => {
    if (
      inputRefs.current &&
      inputRefs.current[index + 1] &&
      annotation !== ''
    ) {
      inputRefs.current[index + 1].focus();
    }

    switch (fileType) {
      case 'inkml':
        dispatch(annotateTraceGroup({ index, annotation }));
        break;
      case 'image':
        dispatch(
          setCurrentAnnotatedImageCropAnnotationAtIndex({ annotation, index }),
        );
        break;
    }
  };

  return (
    <Annotations onDeleteAnnotation={deleteBox} onMarkAsNoise={markAsNoise}>
      {currentWord?.tracegroups.map((tracegroup, index) => (
        <AnnotationCard
          key={index}
          index={index}
          onPress={() => selectBox(index)}
          isSelected={index === selectedBox}
          isNoise={tracegroup.label.type === Char.noise.type}
          onInputChange={(annotation: string) =>
            editAnnotationLabel(annotation, index)
          }
          insertIntoInputRefs={insertIntoInputRefs}>
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
        </AnnotationCard>
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
