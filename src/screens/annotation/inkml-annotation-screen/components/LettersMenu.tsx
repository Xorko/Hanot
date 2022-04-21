import cloneDeep from 'clone-deep';
import { Button, Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createEmptyTraceGroup } from '../../../../core/input';
import { annotate } from '../../../../core/methods';
import * as Trace from '../../../../core/trace';
import * as TraceGroup from '../../../../core/tracegroup';
import * as WordType from '../../../../core/word';
import { RootState } from '../../../../stores/store';
import {
  deleteTraceGroup,
  initWord,
  setFinalTraceGroups,
} from '../current-word-slice';
import Letter from './Letter';

interface LettersMenuProps {
  selectedLetter: Trace.Type[];
}

const windowHeight = Dimensions.get('window').height;

function LettersMenu({ selectedLetter }: LettersMenuProps) {
  const dispatch = useDispatch();

  var currentWord: WordType.Type = useSelector(
    (state: RootState) => state.currentWord,
  );

  const deleteTraceGroups = (index: number): void => {
    if (currentWord) {
      const finalTraceGroups: TraceGroup.Type[] = cloneDeep(
        currentWord.tracegroups,
      );
      const deletedTraceGroups: TraceGroup.Type[] = finalTraceGroups
        .splice(index)
        .reverse();

      deletedTraceGroups.map(traceGroup =>
        dispatch(deleteTraceGroup(traceGroup)),
      );

      dispatch(setFinalTraceGroups(finalTraceGroups));
    }
  };

  /**
   * Modify the annotation of the current traceGroup
   * @param annotation
   * @param traceGroup
   */
  const editLetterAnnotation = (
    annotation: string,
    traceGroup: TraceGroup.Type,
  ): void => {
    annotate(annotation, traceGroup);
  };

  return (
    <View style={styles.box}>
      <ScrollView horizontal contentContainerStyle={styles.scroll}>
        <Button
          title="Press me"
          onPress={() => {
            if (currentWord) {
              const wordCopy = cloneDeep(currentWord);
              wordCopy.tracegroups.push(createEmptyTraceGroup());
              dispatch(initWord(wordCopy));
            }
          }}
        />

        {currentWord?.tracegroups.map((traceGroup, index) => (
          <Letter
            editLetterAnnotation={editLetterAnnotation}
            deleteTraceGroups={deleteTraceGroups}
            traceGroup={traceGroup}
            index={index}
            selectedLetter={selectedLetter}
            key={index}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    flexDirection: 'row',
    height: '30%',
    width: '60%',
    alignItems: 'center',
  },
  scroll: {
    backgroundColor: '#e1e2e1',
    flexGrow: 1,
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttons: {
    backgroundColor: '#e1e2e1',
    height: windowHeight / 3,
    width: 1,
  },
});

export default LettersMenu;
