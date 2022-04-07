import React from 'react';
import {Dimensions, StyleSheet, TextInput, View} from 'react-native';
import Svg from 'react-native-svg';
import * as Trace from '../../../../core/trace';
import * as TraceGroup from '../../../../core/tracegroup';
import {WrittedLetter} from './WritedLetter';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface LetterProps {
  editLetterAnnotation: (arg0: string, arg1: TraceGroup.Type) => void;
  traceGroup: TraceGroup.Type;
  index: number;
  selectedLetter: Trace.Type[];
}

function Letter({editLetterAnnotation, traceGroup, index}: LetterProps) {
  return (
    <View style={styles.box}>
      <Svg style={styles.letterWriting}>
        <WrittedLetter
          //traces={isLast ? selectedLetter : traceGroup.traces}
          traces={traceGroup.traces}
          index={index}
        />
      </Svg>
      <View style={styles.letterTitle}>
        <TextInput
          style={styles.input}
          onChangeText={text => {
            editLetterAnnotation(text, traceGroup);
          }}
          keyboardType="default"
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={1}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignSelf: 'center',
    backgroundColor: '#005b9f',
    height: windowHeight / 4,
    width: windowWidth / 8,
    borderRadius: 20,
  },
  letterWriting: {
    margin: 12,
    height: '65%',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  letterTitle: {
    backgroundColor: 'white',
    height: '18%',
    borderRadius: 10,
    marginBottom: 12,
    marginHorizontal: 60,
  },
  input: {
    borderColor: 'black',
    fontSize: 30,
    textAlign: 'center',
    padding: 0,
  },
});
export default Letter;
