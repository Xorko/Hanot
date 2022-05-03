import React from 'react';
import {
  Button,
  Dimensions,
  LayoutChangeEvent,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import * as Trace from '../../../../core/trace';
import * as TraceGroup from '../../../../core/tracegroup';
import WritedLetter from './WritedLetter';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

type LetterProps = {
  editLetterAnnotation: (annotation: string, index: number) => void;
  deleteTraceGroups: (index: number) => void;
  traceGroup: TraceGroup.Type;
  index: number;
  selectedLetter: Trace.Type[];
};

function Letter({
  editLetterAnnotation,
  traceGroup,
  index,
  deleteTraceGroups,
}: LetterProps) {
  const [sizeView, setSizeView] = React.useState({ width: 0, height: 0 });

  const changeSize = (e: LayoutChangeEvent) => {
    setSizeView({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };

  return (
    <View style={styles.box}>
      <View style={styles.letterWriting} onLayout={changeSize}>
        <svg>
          <WritedLetter traces={traceGroup.traces} sizeComponent={sizeView} />
        </svg>
      </View>
      <View style={styles.letterTitle}>
        <TextInput
          style={styles.input}
          onChangeText={text => {
            editLetterAnnotation(text, index);
          }}
          keyboardType="default"
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={1}
        />
        <Button
          title="X"
          onPress={() => {
            deleteTraceGroups(index);
          }}
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
    marginHorizontal: 10,
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
