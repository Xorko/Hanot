/* eslint-disable prettier/prettier */
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function FileBloc(props: {props: any}) {
  return (
    <Shadow distance={12} viewStyle={{ marginRight: 20, marginBottom: 20 }}>
      <View style={styles.file}>
        <View style={styles.wordPreview} />
        <View style={styles.fileName}>
          <Text>{props.props}</Text>
        </View>
      </View>
    </Shadow>
  );
}

const styles = StyleSheet.create({
  file: {
    flexDirection: 'row',
    alignContent: 'center',
    height: windowHeight / 6,
    width: windowWidth / 3,
    backgroundColor: '#005b9f',
    borderRadius: 20,
    padding: 20,
  },
  wordPreview: {
    width: '40%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  fileName: {
    height: '15%',
    justifyContent: 'center',
  },
});
export default FileBloc;
