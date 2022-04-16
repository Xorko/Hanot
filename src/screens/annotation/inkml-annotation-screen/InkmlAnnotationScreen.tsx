import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Dimensions, StyleSheet, View } from 'react-native';
import Word from './components/Word';
import { RootStackParamList } from '../../../types/navigation-types';
import { TraceContext } from './context/TraceContext';
import { useEffect, useState } from 'react';
import * as Trace from '../../../core/trace';
import * as WordData from '../../../core/word';
import LettersMenu from './components/LettersMenu';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type InkMLAnnotationScreenPropsType = NativeStackScreenProps<
  RootStackParamList,
  'InkMLAnnotationScreen'
>;

const windowWidth = Dimensions.get('window').width;

function InkmlAnnotationScreen({ route }: InkMLAnnotationScreenPropsType) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const { file } = route.params;

  const [selectedLetter, setSelectedLetter] = useState<Trace.Type[]>([]);

  const [currentWord, setCurrentWord] = useState<WordData.Type>();

  useEffect(() => {
    if (file.content) {
      setCurrentWord(file.content.words[0]);
    }
  }, [file.content]);

  /**
   * Modify the traces of the current traceGroup to write in current box
   * @param traces
   */
  const editLetterTraces = (traces: Trace.Type[]): void => {
    setSelectedLetter(traces);
  };

  const changeCurrentWord = (word: WordData.Type): void => {
    setCurrentWord(word);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.annotation}>
        <TraceContext.Provider value={{ currentWord, changeCurrentWord }}>
          <View style={styles.home}>
            <Button
              title="Menu"
              onPress={() => navigation.navigate('FileSelectionScreen', {})}
            />
          </View>
          <LettersMenu selectedLetter={selectedLetter} />
          <Word editLetterTraces={editLetterTraces} />
        </TraceContext.Provider>
      </View>
    </View>
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
});
export default InkmlAnnotationScreen;
