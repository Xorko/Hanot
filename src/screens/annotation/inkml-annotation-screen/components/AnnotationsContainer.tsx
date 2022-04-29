import { cloneDeep } from 'lodash';
import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import SvgContainer from '../../../../components/SvgContainer';
import { createEmptyTraceGroup } from '../../../../core/input';
import { useAppDispatch, useAppSelector } from '../../../../stores/hooks';
import Annotation from '../../components/Annotation';
import Annotations from '../../components/Annotations';
import { Size } from '../../types/coordinates-types';
import { initWord } from '../current-word-slice';
import LetterPolyline from './LetterPolyline';

function AnnotationsContainer() {
  const dispatch = useAppDispatch();
  const currentWord = useAppSelector(state => state.currentWord);

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

  return (
    <Annotations type="inkml" onAddDiacritic={handleAddBox}>
      {currentWord?.tracegroups.map((tracegroup, index) => (
        <Annotation key={index}>
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
