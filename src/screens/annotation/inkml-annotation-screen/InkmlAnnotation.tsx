import { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import SvgContainer from '../../../components/SvgContainer';
import { useAppDispatch } from '../../../stores/hooks';
import { InkMLFile } from '../../../types/file-import-types';
import AnnotationArea from '../components/AnnotationArea';
import Annotations from '../components/Annotations';
import Header from '../components/Header';
import { getExtremePointsOfPath } from '../image-annotation-screen/utils/crop-utils';
import Workspace from './components/Workspace';
import { initWord } from './current-word-slice';

type InkmlAnnotationProps = {
  file: InkMLFile;
};

function InkmlAnnotation({ file }: InkmlAnnotationProps) {
  const dispatch = useAppDispatch();

  const [min, setMin] = useState<{ minX: number; minY: number; scale: number }>(
    {
      minX: 0,
      minY: 0,
      scale: 1,
    },
  );
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

      const { minX, minY, maxX, maxY } = getExtremePointsOfPath(dots);

      const wordidth = maxX - minX;
      const wordHeight = maxY - minY;

      // The plus 5 is to make sure the word is not cropped
      const scale = Math.min(
        areaSize.width / (wordidth + 5),
        areaSize.height / (wordHeight + 5),
      );

      const widthDif = (areaSize.width - wordidth * scale) / 6;
      const heightDif = (areaSize.height - wordHeight * scale) / 6;
      const dif = widthDif > 0 ? minX - widthDif : minX;
      console.log(dif);

      setMin({
        minX: widthDif > 0 ? minX - widthDif : minX,
        minY: heightDif > 0 ? minY - heightDif : minY,
        scale,
      });
    }
  }, [file.content, dispatch, areaSize]);

  return (
    <View style={styles.container}>
      <Header type="inkml" />
      <Annotations type="inkml" />
      <AnnotationArea>
        <View
          onLayout={(event: LayoutChangeEvent) =>
            setAreaSize(event.nativeEvent.layout)
          }
          style={styles.area}>
          <SvgContainer>
            <Workspace wordMinCoordinates={min} />
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
