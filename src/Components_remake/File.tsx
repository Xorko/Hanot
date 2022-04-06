import {useContext} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Shadow} from 'react-native-shadow-2';
import {FileTypeContext} from '../Context/FileTypeContext';
import {ModeContext} from '../Context/ModeContext';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../types/NavigationTypes';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface FileProps {
  file: any;
}

const File = ({file}: FileProps) => {
  const {mode} = useContext(ModeContext);
  const {type} = useContext(FileTypeContext);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    if (type === 'image') {
      navigation.navigate('ImageAnnotationScreen', {file: file});
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Shadow distance={12} viewStyle={styles.shadow}>
        <View style={mode === 'block' ? styles.fileBlock : styles.fileList}>
          <View
            style={
              mode === 'block'
                ? styles.wordPreviewBlock
                : styles.wordPreviewList
            }
          />
          <View style={styles.fileName}>
            <Text>{file.fileName}</Text>
          </View>
        </View>
      </Shadow>
    </TouchableOpacity>
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
  shadow: {
    marginRight: 20,
    marginBottom: 20,
  },
});

export default File;
