import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import IconButton from '../../../components/IconButton';
import { useScrollViewRef } from '../context/ScrollViewRefContext';
import { useSelectedBox } from '../context/SelectedBoxContext';

type AnnotationsProps = {
  children?: React.ReactNode;
  onDeleteAnnotation?: () => void;
  onMarkAsNoise?: () => void;
};

type AnnotationsButtonsProps = {
  onDeleteAnnotation?: () => void;
  onMarkAsNoise?: () => void;
};

function Annotations({
  children,
  onDeleteAnnotation,
  onMarkAsNoise,
}: AnnotationsProps) {
  const scrollviewRef = useRef<ScrollView>(null);
  const { setScrollViewRef } = useScrollViewRef();

  useEffect(() => {
    setScrollViewRef(scrollviewRef);
  }, [scrollviewRef, setScrollViewRef]);

  return (
    <View style={annotationStyle.container}>
      <View style={annotationStyle.ScrollViewContainer}>
        <ScrollView
          horizontal
          ref={scrollviewRef}
          style={annotationStyle.scrollView}>
          {children}
        </ScrollView>
      </View>
      <AnnotationsButtons
        onDeleteAnnotation={onDeleteAnnotation}
        onMarkAsNoise={onMarkAsNoise}
      />
    </View>
  );
}

function AnnotationsButtons({
  onDeleteAnnotation,
  onMarkAsNoise,
}: AnnotationsButtonsProps) {
  const { selectedBox } = useSelectedBox();

  return (
    <View style={buttonsStyle.container}>
      <IconButton
        library="material"
        iconName="close-circle"
        onPress={onDeleteAnnotation}
        iconSize={70}
        color="danger"
        pressable={selectedBox !== undefined}
      />
      <IconButton
        library="material"
        iconName="alert-circle"
        onPress={onMarkAsNoise}
        iconSize={70}
        color="warning"
        pressable={selectedBox !== undefined}
      />
    </View>
  );
}

const annotationStyle = StyleSheet.create({
  container: {
    flex: 0.4,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  ScrollViewContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 10,
  },
  scrollView: {
    paddingLeft: 10,
  },
});

const buttonsStyle = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    backgroundColor: '#E0E0E0',
  },
});

export default Annotations;
