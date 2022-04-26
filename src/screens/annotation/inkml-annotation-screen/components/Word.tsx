import React from 'react';
import { Dimensions, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import * as Trace from '../../../../core/trace';
import AnnotationArea from './AnnotationArea';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

type WordProps = {
  editLetterTraces: (traces: Trace.Type[]) => void;
};

function Word({ editLetterTraces }: WordProps) {
  const [sizeView, setSizeView] = React.useState({ width: 0, height: 0 });

  const changeSize = (e: LayoutChangeEvent) => {
    setSizeView({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };

  return (
    <View style={styles.main}>
      <View style={styles.box} onLayout={changeSize}>
        <AnnotationArea
          editLetterTraces={editLetterTraces}
          sizeComponent={sizeView}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  box: {
    backgroundColor: 'white',
    alignSelf: 'center',
    height: windowHeight / 3.0,
    width: windowWidth / 1.5,
    borderRadius: 35,
    borderWidth: 20,
    borderColor: '#0071ac',
    overflow: 'hidden',
  },
});
export default Word;
