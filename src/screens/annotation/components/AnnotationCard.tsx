import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useFileType } from '../../../context/FileTypeContext';
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
  insertIntoInputRefs?: (ref: TextInput, index: number) => void;
};

type AnnotationInputProps = {
  onInputChange?: (text: string) => void;
  index: number;
  isNoise?: boolean;
  insertIntoInputRefs?: (ref: TextInput, index: number) => void;
};

function Annotation({
  children,
  index,
  onInputChange,
  onPress,
  isSelected = false,
  isNoise = false,
  insertIntoInputRefs,
  backgroundColor = colors.light,
}: AnnotationProps) {
  return (
    <View
      style={[
        Platform.OS === 'web'
          ? annotationStyle.webContainer
          : annotationStyle.container,
        isNoise && styles.noise,
        isSelected && annotationStyle.selectedColor,
        { backgroundColor },
      ]}>
      <Pressable onPress={onPress} style={annotationStyle.preview}>
        {children}
      </Pressable>
      <AnnotationInput
        onInputChange={onInputChange}
        index={index}
        isNoise={isNoise}
        insertIntoInputRefs={insertIntoInputRefs}
      />
    </View>
  );
}

function AnnotationInput({
  onInputChange,
  index,
  isNoise,
  insertIntoInputRefs,
}: AnnotationInputProps) {
  const { fileType } = useFileType();
  const _char = useAppSelector(state => {
    switch (fileType) {
      case 'inkml':
        return state.currentWord.tracegroups[index].label;
      case 'image':
        return (
          state.currentAnnotatedImage.imageCrops[index].cropAnnotation || ''
        );
    }
  });

  /**
   * Temporary solution to get the character from the annotation.
   * InkMLAnnotation uses Char type while ImageAnnotation uses string.
   * @param char The character to get the value from.
   */
  const getCharacterValue = (char: Char.Type | string) => {
    if (typeof char === 'string') {
      if (char === 'noise') {
        return '#';
      }
      return char;
    }

    const value = Char.getChar(char);
    if (value) {
      if (value === '#noise') {
        return '#';
      }
      return value || '';
    }
  };

  return (
    <View
      style={
        Platform.OS !== 'web' && [
          inputStyles.container,
          isNoise && styles.noise,
        ]
      }>
      <TextInput
        value={getCharacterValue(_char)}
        maxLength={1}
        autoCorrect={false}
        autoCapitalize="none"
        selectTextOnFocus
        onChangeText={onInputChange}
        placeholder="Aa"
        textAlign="center"
        multiline={Platform.OS !== 'web'}
        style={
          Platform.OS === 'web'
            ? [inputStyles.inputWeb, isNoise && styles.noise]
            : inputStyles.input
        }
        placeholderTextColor={isNoise ? colors.light : '#BFBFBF'}
        selectionColor={'rgba(0,0,0,0.5)'}
        ref={ref => {
          if (insertIntoInputRefs && ref) {
            insertIntoInputRefs(ref, index);
          }
        }}
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
  webContainer: {
    width: 200,
    flex: 1,
    margin: 10,
    borderRadius: 25,
    borderWidth: 5,
    borderColor: colors.primary,
    backgroundColor: colors.light,
  },
  selectedColor: {
    opacity: 0.5,
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
  inputWeb: {
    flex: 1,
    padding: 4,
    marginTop: 5,
    marginHorizontal: 50,
    fontSize: 18,
    borderRadius: 100,
    backgroundColor: colors.primary,
    textAlign: 'center',
    color: colors.light,
  },
});

export default Annotation;
