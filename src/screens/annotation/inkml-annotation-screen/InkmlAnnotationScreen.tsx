import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import {
  Button,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import * as Trace from '../../../core/trace';
import { addAnnotatedInkml } from '../../../shared/annotated-inkml-files-slice';
import { useAppDispatch, useAppSelector } from '../../../stores/hooks';
import { RootStackParamList } from '../../../types/navigation-types';
import LettersMenu from './components/LettersMenu';
import Word from './components/Word';
import { initWord } from './current-word-slice';

type InkMLAnnotationScreenPropsType = NativeStackScreenProps<
  RootStackParamList,
  'InkMLAnnotationScreen'
>;

const windowWidth = Dimensions.get('window').width;

function InkmlAnnotationScreen({ route }: InkMLAnnotationScreenPropsType) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const { file } = route.params;

  const [selectedLetter, setSelectedLetter] = useState<Trace.Type[]>([]);

  const dispatch = useAppDispatch();

  const currentWord = useAppSelector(state => state.currentWord);

  useEffect(() => {
    if (file.content) {
      dispatch(initWord(file.content.words[0]));
    }
  }, [file.content, dispatch]);

  /**
   * Modify the traces of the current traceGroup to write in current box
   * @param traces
   */
  const editLetterTraces = (traces: Trace.Type[]): void => {
    setSelectedLetter(traces);
  };

  const handleValidate = (): void => {
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
    dispatch(addAnnotatedInkml({ filePath: file.filePath, content: inkml }));

    Toast.show({
      type: 'success',
      text1: 'Inkml successfully annotated',
      visibilityTime: 1000,
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.annotation}>
        <View style={styles.home}>
          <Button
            title="Menu"
            onPress={() => navigation.navigate('FileSelectionScreen', {})}
          />
        </View>
        <LettersMenu selectedLetter={selectedLetter} />
        <Word editLetterTraces={editLetterTraces} />
      </View>
      <View style={styles.annotate}>
        <Button title="Validate" onPress={handleValidate} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  annotation: {
    flex: 1,
    width: windowWidth / 1.07,
    backgroundColor: '#e1e2e1',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 40,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  screen: {
    height: '100%',
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  home: {
    position: 'absolute',
    right: 30,
    top: 30,
  },
  annotate: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
});
export default InkmlAnnotationScreen;
