import {useContext} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import {ModeContext} from '../Context/ModeContext';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface FileProps {
  fileName: string;
}

const File = ({fileName}: FileProps) => {
  const {mode} = useContext(ModeContext);

  const shadowStyle = {marginRight: 20, marginBottom: 20};

  return (
    <Shadow distance={12} viewStyle={shadowStyle}>
      <View style={mode === 'block' ? styles.fileBlock : styles.fileList}>
        <View
          style={
            mode === 'block' ? styles.wordPreviewBlock : styles.wordPreviewList
          }
        />
        <View style={styles.fileName}>
          <Text>{fileName}</Text>
        </View>
      </View>
    </Shadow>
  );
};

const styles = StyleSheet.create({
  fileList: {
    flexDirection: 'row',
    alignContent: 'center',
    height: windowHeight / 10,
    width: windowWidth / 3,
    backgroundColor: '#005b9f',
    borderRadius: 20,
    padding: 20,
  },
  wordPreviewList: {
    width: '15%',
    height: '100%',
    backgroundColor: 'white',
  },
  fileBlock: {
    flexDirection: 'row',
    alignContent: 'center',
    height: windowHeight / 6,
    width: windowWidth / 3,
    backgroundColor: '#005b9f',
    borderRadius: 20,
    padding: 20,
  },
  wordPreviewBlock: {
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

export default File;
