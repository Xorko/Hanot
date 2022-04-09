import React, {useContext} from 'react';
import {Button, Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {addAnnotationUnit, annotate} from '../../../../core/methods';
import {TraceContext} from '../context/TraceContext';
import * as Trace from '../../../../core/trace';
import * as TraceGroup from '../../../../core/tracegroup';
import Letter from './Letter';
const cloneDeep = require('clone-deep');

interface LettersMenuProps {
  selectedLetter: Trace.Type[];
}

const windowHeight = Dimensions.get('window').height;

function LettersMenu({selectedLetter}: LettersMenuProps) {
  const {currentWord, changeCurrentWord} = useContext(TraceContext);

  /**
   * State saving the current index of the last Letters coponent added.
   */
  const [maxIndexLetter, setMaxIndexLetter] = React.useState(-1);

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
            setMaxIndexLetter(maxIndexLetter + 1);

            if (currentWord) {
              const wordCopy = cloneDeep(currentWord);
              addAnnotationUnit(wordCopy, maxIndexLetter);
              changeCurrentWord(wordCopy);
            }
          }}
        />

        {currentWord?.tracegroups.map((traceGroup, index) => (
          <Letter
            editLetterAnnotation={editLetterAnnotation}
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
