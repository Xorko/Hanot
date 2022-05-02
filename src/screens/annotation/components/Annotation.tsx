import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import * as Char from '../../../core/char';
import { useAppSelector } from '../../../stores/hooks';
import colors from '../../../style/colors';

type AnnotationProps = {
  children?: React.ReactNode;
  index: number;
  onPress?: (...args: any[]) => void;
  onInputChange?: (text: string) => void;
  isSelected?: boolean;
  isNoise?: boolean;
  backgroundColor?: string;
};

type AnnotationInputProps = {
  onInputChange?: (text: string) => void;
  index: number;
  isNoise?: boolean;
};

function Annotation({
  children,
  index,
  onInputChange,
  onPress,
  isSelected = false,
  isNoise = false,
  backgroundColor = colors.light,
}: AnnotationProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        { ...annotationStyle.container, backgroundColor },
        isNoise && { ...styles.noise, backgroundColor },
        isSelected && { ...annotationStyle.selectedColor, backgroundColor },
      ]}>
      <View style={annotationStyle.preview}>{children}</View>
      <AnnotationInput
        onInputChange={onInputChange}
        index={index}
        isNoise={isNoise}
      />
    </Pressable>
  );
}

function AnnotationInput({
  onInputChange,
  index,
  isNoise,
}: AnnotationInputProps) {
  const charValue = useAppSelector(
    state => state.currentWord.tracegroups[index].label,
  );

  return (
    <View style={[inputStyles.container, isNoise && styles.noise]}>
      <TextInput
        value={Char.getChar(charValue) || ''}
        maxLength={1}
        autoCorrect={false}
        autoCapitalize="none"
        selectTextOnFocus
        onChangeText={onInputChange}
        placeholder="Aa"
        textAlign="center"
        multiline
        style={inputStyles.input}
        placeholderTextColor={isNoise ? colors.light : '#BFBFBF'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  noise: {
    backgroundColor: colors.warning,
    borderColor: colors.warning,
  },
});

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
