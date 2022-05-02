import { useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import IconButton from '../../../components/IconButton';

type AnnotationsProps = {
  children?: React.ReactNode;
  onDeleteAnnotation?: () => void;
  onMarkAsNoise?: () => void;
};

type AnnotationsButtonsProps = {
  scrollToEnd?: () => void;
  onDeleteAnnotation?: () => void;
  onMarkAsNoise?: () => void;
};

function Annotations({
  children,
  onDeleteAnnotation,
  onMarkAsNoise,
}: AnnotationsProps) {
  const scrollviewRef = useRef<ScrollView>(null);

  const scrollToEnd = () => {
    scrollviewRef.current?.scrollToEnd({ animated: true });
  };

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
        scrollToEnd={scrollToEnd}
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
  return (
    <View style={buttonsStyle.container}>
      <IconButton
        library="material"
        iconName="close-circle"
        onPress={onDeleteAnnotation}
        iconSize={70}
        color="danger"
      />
      <IconButton
        library="material"
        iconName="alert-circle"
        onPress={onMarkAsNoise}
        iconSize={70}
        color="warning"
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
