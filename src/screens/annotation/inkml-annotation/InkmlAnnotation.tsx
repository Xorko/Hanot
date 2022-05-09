import { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import SvgContainer from '../../../components/SvgContainer';
import { addAnnotatedInkml } from '../../../shared/annotated-files-slice';
import { useAppDispatch, useAppSelector } from '../../../stores/hooks';
import { Size } from '../../../types/coordinates-types';
import { InkMLFile } from '../../../types/file-import-types';
import AnnotationArea from '../components/AnnotationArea';
import Header from '../components/Header';
import { SelectedBoxProvider } from '../context/SelectedBoxContext';
import AnnotationsContainer from './components/AnnotationsContainer';
import Workspace from './components/Workspace';
import { PolylineTransformProvider } from './context/PolylineTransformContext';
import { initialState, initWord } from './current-word-slice';

type InkmlAnnotationProps = {
  file: InkMLFile;
};

function InkmlAnnotation({ file }: InkmlAnnotationProps) {
  const dispatch = useAppDispatch();
  const currentWord = useAppSelector(state => state.currentWord);
  const currentAnnotatedWords = useAppSelector(
    state => state.annotatedFiles.annotatedInkml,
  );

  const [areaSize, setAreaSize] = useState<Size>();

  const validate = () => {
    const word = {
      tracegroups: currentWord.tracegroups,
      defaultTraceGroup: currentWord.defaultTraceGroup,
      annotations: currentWord.annotations,
      attributes: currentWord.attributes,
      predicted: currentWord.predicted,
    };
    const inkml = {
      words: [word],
    };
    dispatch(
      addAnnotatedInkml({ id: file.id, content: inkml, '?xml': file['?xml'] }),
    );

    Toast.show({
      type: 'success',
      text1: 'Annotation validée',
      visibilityTime: 1000,
    });
  };

  const onGoBack = () => {
    dispatch(initWord(initialState));
  };

  useEffect(() => {
    if (file.content) {
      const annotatedFile = currentAnnotatedWords.find(_file => {
        return _file.id === file.id;
      });

      dispatch(
        initWord(
          annotatedFile
            ? annotatedFile.content.words[0]
            : file.content.words[0],
        ),
      );
    }
  }, [dispatch, file.id, file.content, currentAnnotatedWords]);

  return (
    <View style={styles.container}>
      <Header onValidate={validate} onGoBack={onGoBack} />
      <SelectedBoxProvider initialSelectedBox={undefined}>
        <AnnotationsContainer />
        <AnnotationArea>
          <View
            style={styles.area}
            onLayout={(event: LayoutChangeEvent) =>
              setAreaSize(event.nativeEvent.layout)
            }>
            <SvgContainer>
              <PolylineTransformProvider>
                {areaSize && <Workspace areaSize={areaSize} />}
              </PolylineTransformProvider>
            </SvgContainer>
          </View>
        </AnnotationArea>
      </SelectedBoxProvider>
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
