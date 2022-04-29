import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import colors from '../../../style/colors';

type AnnotationProps = {
  children?: React.ReactNode;
  onPress?: (...args: any[]) => void;
  onInputChange?: (text: string) => void;
  selected?: boolean;
};

type AnnotationInputProps = {
  onInputChange?: (text: string) => void;
};

function Annotation({
  children,
  onInputChange,
  onPress,
  selected = false,
}: AnnotationProps) {
  return (
    <Pressable
      onPress={onPress}
      style={
        selected
          ? [annotationStyle.container, annotationStyle.selectedColor]
          : annotationStyle.container
      }>
      <View style={annotationStyle.preview}>{children}</View>
      <AnnotationInput onInputChange={onInputChange} />
    </Pressable>
  );
}

function AnnotationInput({ onInputChange }: AnnotationInputProps) {
  return (
    <View style={inputStyles.container}>
      <TextInput
        maxLength={1}
        autoCorrect={false}
        autoCapitalize="none"
        selectTextOnFocus
        onChangeText={onInputChange}
        placeholder="Aa"
        textAlign="center"
        multiline
        style={inputStyles.input}
        placeholderTextColor={'#BFBFBF'}
      />
    </View>
  );
}

const annotationStyle = StyleSheet.create({
  container: {
    width: 185,
    flex: 0.2,
    margin: 10,
    borderRadius: 25,
    borderWidth: 5,
    borderColor: colors.primary,
    backgroundColor: colors.light,
  },
  selectedColor: {
    borderColor: colors.secondary,
  },
  preview: {
    flex: 0.9,
    margin: 10,
  },
});

const inputStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 50,
    borderRadius: 100,
    backgroundColor: colors.primary,
  },
  input: {
    fontSize: 20,
    color: colors.light,
  },
});

export default Annotation;
