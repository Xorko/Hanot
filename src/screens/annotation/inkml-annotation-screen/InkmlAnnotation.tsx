import { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import SvgContainer from '../../../components/SvgContainer';
import { useAppDispatch } from '../../../stores/hooks';
import { InkMLFile } from '../../../types/file-import-types';
import AnnotationArea from '../components/AnnotationArea';
import Header from '../components/Header';
import { SelectedBoxProvider } from '../context/SelectedBoxContext';
import AnnotationsContainer from './components/AnnotationsContainer';
import Workspace from './components/Workspace';
import { PolylineTransformProvider } from './context/PolylineTransformContext';
import { initWord } from './current-word-slice';
import { Transform } from './types/annotation-types';
import { getTransform } from './utils/transform-utils';

type InkmlAnnotationProps = {
  file: InkMLFile;
};

function InkmlAnnotation({ file }: InkmlAnnotationProps) {
  const dispatch = useAppDispatch();

  const [inkmlTransform, setInkmlTransform] = useState<Transform>();

  const [areaSize, setAreaSize] = useState<{ width: number; height: number }>();

  useEffect(() => {
    if (file.content && areaSize) {
      dispatch(initWord(file.content.words[0]));
      const defaultTraceGroups = file.content.words[0].defaultTraceGroup;
      const traceGroups = file.content.words[0].tracegroups.map(
        traceGroup => traceGroup.traces,
      );
      const traces = defaultTraceGroups.concat(...traceGroups);
      const dots = traces
        .map(trace =>
          trace.dots.map(({ x, y }) => {
            return { x, y };
          }),
        )
        .flat();
      setInkmlTransform(getTransform(dots, areaSize));
    }
  }, [file.content, dispatch, areaSize]);

  return (
    <View style={styles.container}>
      <Header type="inkml" />
      <SelectedBoxProvider initialSelectedBox={undefined}>
        <AnnotationsContainer />
      </SelectedBoxProvider>
      <AnnotationArea>
        <View
          onLayout={(event: LayoutChangeEvent) =>
            setAreaSize(event.nativeEvent.layout)
          }
          style={styles.area}>
          <SvgContainer>
            {inkmlTransform && (
              <PolylineTransformProvider initialTransform={inkmlTransform}>
                <Workspace />
              </PolylineTransformProvider>
            )}
          </SvgContainer>
        </View>
      </AnnotationArea>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    flex: 1,
  },
  area: {
    flex: 1,
  },
});

export default InkmlAnnotation;
