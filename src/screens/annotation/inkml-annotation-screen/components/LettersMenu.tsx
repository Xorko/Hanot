import React from 'react';
import { Button, Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { addTraceGroup, annotate } from '../../../../core/methods';
import * as Trace from '../../../../core/trace';
import * as TraceGroup from '../../../../core/tracegroup';
import { useCurrentWordContext } from '../context/CurrentWordContext';
import Letter from './Letter';
const cloneDeep = require('clone-deep');
import * as WordData from '../../../../core/word';

interface LettersMenuProps {
  selectedLetter: Trace.Type[];
}

const windowHeight = Dimensions.get('window').height;

function LettersMenu({ selectedLetter }: LettersMenuProps) {
  const { currentWord, changeCurrentWord } = useCurrentWordContext();

  const deleteOneTraceGroup = (traceGroup: TraceGroup.Type): void => {
    if (currentWord) {
      traceGroup.traces.map(trace => {
        currentWord.defaultTraceGroup[trace.oldTrace].dots = [
          ...trace.dots,
          ...currentWord.defaultTraceGroup[trace.oldTrace].dots,
        ];
      });
    }
  };

  const deleteTraceGroups = (index: number): void => {
    if (currentWord) {
      const finalTraceGroups: TraceGroup.Type[] = currentWord.tracegroups;
      const deletedTraceGroups: TraceGroup.Type[] = finalTraceGroups
        .splice(index)
        .reverse();
      deletedTraceGroups.map(traceGroup => deleteOneTraceGroup(traceGroup));
      const current: WordData.Type = {
        tracegroups: finalTraceGroups,
        defaultTraceGroup: currentWord.defaultTraceGroup,
        annotations: currentWord.annotations,
        attributes: currentWord.attributes,
        predicted: currentWord.predicted,
      };
      changeCurrentWord(current);
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
              addTraceGroup(wordCopy);
              changeCurrentWord(wordCopy);
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
