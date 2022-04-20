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
import * as Trace from '../../../core/trace';
import * as WordData from '../../../core/word';
import { RootStackParamList } from '../../../types/navigation-types';
import LettersMenu from './components/LettersMenu';
import Word from './components/Word';
import { CurrentWordProvider } from './context/CurrentWordContext';

type InkMLAnnotationScreenPropsType = NativeStackScreenProps<
  RootStackParamList,
  'InkMLAnnotationScreen'
>;

const windowWidth = Dimensions.get('window').width;

function InkmlAnnotationScreen({ route }: InkMLAnnotationScreenPropsType) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const { file } = route.params;

  const [selectedLetter, setSelectedLetter] = useState<Trace.Type[]>([]);
  const [currentWord, setCurrentWord] = useState<WordData.Type | undefined>();

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

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.annotation}>
        {currentWord && (
          <CurrentWordProvider initialCurrentTrace={currentWord}>
            <View style={styles.home}>
              <Button
                title="Menu"
                onPress={() => navigation.navigate('FileSelectionScreen', {})}
              />
            </View>
            <LettersMenu selectedLetter={selectedLetter} />
            <Word editLetterTraces={editLetterTraces} />
          </CurrentWordProvider>
        )}
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
});
export default InkmlAnnotationScreen;
