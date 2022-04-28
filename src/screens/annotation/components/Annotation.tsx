import { StyleSheet, TextInput, View } from 'react-native';
import PolylineRenderer from '../../../components/PolylineRenderer';
import SvgContainer from '../../../components/SvgContainer';
import colors from '../../../style/colors';

function Annotation() {
  return (
    <View style={annotationStyle.container}>
      <View style={annotationStyle.preview}>
        <SvgContainer>
          <PolylineRenderer points={[]} />
        </SvgContainer>
      </View>
      <AnnotationInput />
    </View>
  );
}

function AnnotationInput() {
  return (
    <View style={inputStyles.container}>
      <TextInput
        maxLength={1}
        autoCorrect={false}
        autoCapitalize="none"
        selectTextOnFocus
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
